const API = 'https://api.anthropic.com/v1/messages'

async function stream(system, userMsg, onChunk) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      stream: true,
      system,
      messages: [{ role: 'user', content: userMsg }]
    })
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  const reader = res.body.getReader()
  const dec = new TextDecoder()
  let full = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const lines = dec.decode(value).split('\n')
    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const data = line.slice(5).trim()
      if (data === '[DONE]') break
      try {
        const j = JSON.parse(data)
        if (j.type === 'content_block_delta' && j.delta?.text) {
          full += j.delta.text
          onChunk(full)
        }
      } catch {}
    }
  }
  return full
}

const INCOME_MAP = { low: 'under KES 10,000/month', mid: 'KES 10–30,000/month', high: 'KES 30–60,000/month', formal: 'KES 60,000+/month' }

export async function runScout(app, onChunk) {
  const system = `You are the Scout Agent for Ujima SACCO — a financial literacy coach for informal traders in Kenya and Uganda.
RANK boundaries: Educate only. Never recommend specific loan products. Empathetic tone — like a knowledgeable village auntie, never a bank manager.
Acknowledge Kenyan harvest cycles when relevant (maize: April/May, Oct/Nov; matooke: March/April, Sept/Oct).
Keep response to 3–4 sentences. Plain conversational English. No markdown, no bullet points.`

  const msg = `Member: ${app.name}, ${app.age}yo, ${app.occ}, ${app.county} County.
Income: ${INCOME_MAP[app.income] || app.income}. Children under 5: ${app.children || 0}. Harvest-cycle applicant: ${app.harvest ? 'yes' : 'no'}.
Loan purpose: ${app.purpose}, KES ${Number(app.amount).toLocaleString()}.
Write a brief, empathetic financial literacy note for this member.`

  return stream(system, msg, onChunk)
}

export async function runGuardian(app, scoutOutput, onChunk) {
  const system = `You are the Guardian Agent for Ujima SACCO — loan triage officer.
RANK boundaries:
- Approve ≤ KES 15,000 with fewer than 2 risk flags
- Escalate to Hunter if: amount > KES 15,000 OR 2+ children under 5 OR medical emergency OR Busia County
- NEVER deny without citing 3+ specific risk flags
- DIGNITY FILTER: never use "unreliable" or "risky" — use respectful, actionable language
- Validate income against Kenyan harvest cycles
Format: 3–5 sentences. State triage decision, top 2 risk factors assessed, and escalation rationale if needed. No markdown.`

  const msg = `Application: ${app.name}, ${app.age}yo, ${app.occ}, ${app.county}.
Income: ${INCOME_MAP[app.income] || app.income} | Harvest applicant: ${app.harvest ? 'yes' : 'no'} | Children under 5: ${app.children || 0}
Loan: KES ${Number(app.amount).toLocaleString()} for ${app.purpose}
Busia County: ${app.county === 'Busia' ? 'YES — flag for mandatory human review' : 'no'}
Scout context: ${scoutOutput.slice(0, 220)}
Triage this application within your RANK boundaries.`

  return stream(system, msg, onChunk)
}

export async function runHunter(app, guardianOutput, onChunk) {
  const system = `You are the Hunter Agent for Ujima SACCO — human-in-loop coordinator.
RANK boundaries:
- NEVER approve or deny loans — prepare briefing packets for human officers only
- Alert officer within 15 minutes for high-priority applications
- Match officer to applicant expertise
- Include one cross-sell opportunity when appropriate (drought insurance, savings product)
- DIGNITY FILTER: all output must be respectful and actionable
Write a concise officer briefing: member summary, income analysis, harvest alignment, risk flags, officer recommendation, optional cross-sell. Plain prose, 4–6 sentences.`

  const amtNum = Number(app.amount)
  const highPriority = amtNum > 50000 || (app.children >= 2) || app.purpose === 'Medical emergency'

  const msg = `Prepare officer briefing for:
${app.name}, ${app.age}yo, ${app.occ}, ${app.county}
Loan: KES ${amtNum.toLocaleString()} for ${app.purpose}
Income: ${INCOME_MAP[app.income] || app.income} | Harvest: ${app.harvest ? 'yes' : 'no'} | Children under 5: ${app.children || 0}
High-priority flag: ${highPriority ? 'YES' : 'no'} | Busia County: ${app.county === 'Busia' ? 'YES' : 'no'}
Guardian assessment: ${guardianOutput.slice(0, 280)}`

  return stream(system, msg, onChunk)
}
