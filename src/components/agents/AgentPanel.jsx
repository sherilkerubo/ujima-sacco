import { useEffect, useRef, useState } from 'react'
import { runScout, runGuardian, runHunter } from '../../services/agents'
import { AlertTriangle, ArrowRight } from 'lucide-react'

const PHASES = [
  { id:'scout',    label:'Scout',    tagCls:'scout',    desc:'Literacy Coach' },
  { id:'guardian', label:'Guardian', tagCls:'guardian', desc:'Loan Triage' },
  { id:'hunter',   label:'Hunter',   tagCls:'hunter',   desc:'Officer Briefing' },
]

export default function AgentPanel({ application, onComplete }) {
  const [phase, setPhase] = useState(0)       // 0=scout,1=guardian,2=hunter,3=done
  const [texts, setTexts] = useState(['','',''])
  const [thinking, setThinking] = useState(true)
  const [guards, setGuards] = useState([])
  const ran = useRef(false)

  const amtNum = Number(application.amount) || 0
  const childNum = Number(application.children) || 0

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    runAll()
  }, [])

  async function runAll() {
    // Detect GUARD triggers upfront
    const g = []
    if (application.county === 'Busia') g.push('Busia County — mandatory human review per anti-bias protocol')
    if (amtNum > 50000) g.push('Amount exceeds KES 50,000 — senior officer pause point activated')
    if (childNum >= 2) g.push('2+ children under 5 — welfare pause point, human review required')
    if (application.purpose === 'Medical emergency') g.push('Medical emergency — escalation flag raised for Guardian → Hunter')
    setGuards(g)

    try {
      // SCOUT
      setPhase(0); setThinking(true)
      const scoutOut = await runScout(application, (t) => {
        setThinking(false)
        setTexts(prev => { const n=[...prev]; n[0]=t; return n })
      })

      // GUARDIAN
      setPhase(1); setThinking(true)
      await new Promise(r => setTimeout(r, 600))
      const guardOut = await runGuardian(application, scoutOut, (t) => {
        setThinking(false)
        setTexts(prev => { const n=[...prev]; n[1]=t; return n })
      })

      // HUNTER
      setPhase(2); setThinking(true)
      await new Promise(r => setTimeout(r, 600))
      await runHunter(application, guardOut, (t) => {
        setThinking(false)
        setTexts(prev => { const n=[...prev]; n[2]=t; return n })
      })

      setPhase(3)
      if (onComplete) onComplete()

    } catch (err) {
      setThinking(false)
      setTexts(prev => { const n=[...prev]; n[phase]='[Agent unavailable — check API key]'; return n })
    }
  }

  const chipState = (i) => {
    if (phase > i) return 'done'
    if (phase === i) return 'active'
    return ''
  }

  return (
    <div className="agent-panel fade-in" style={{ position:'sticky', top:24 }}>
      {/* Terminal header */}
      <div className="agent-panel-header">
        <div className="agent-dot green" style={{ ...(phase < 3 ? {animation:'agentPulse 1.2s ease-in-out infinite'} : {}) }}/>
        <div className="agent-dot amber"/>
        <div className="agent-dot" style={{ background:'var(--danger)', width:8, height:8, borderRadius:'50%' }}/>
        <span style={{ marginLeft:8, fontFamily:'var(--ff-mono)', fontSize:'0.78rem', color:'rgba(255,255,255,.45)' }}>
          agent-pride — {phase < 3 ? 'running…' : 'complete ✓'}
        </span>
      </div>

      {/* Agent chips */}
      <div className="agent-bar">
        {PHASES.map((p,i) => (
          <div key={p.id} className={`agent-chip ${chipState(i)}`}>
            <div className="agent-chip-dot"/>
            {p.label}
          </div>
        ))}
        {guards.length > 0 && (
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5, fontSize:'0.7rem', color:'#ff8080', fontFamily:'var(--ff-mono)' }}>
            <AlertTriangle size={12}/> {guards.length} guard{guards.length>1?'s':''}
          </div>
        )}
      </div>

      {/* GUARD alerts */}
      {guards.map((g,i) => (
        <div key={i} className="guard-alert" style={{ margin:'12px 20px 0' }}>
          <AlertTriangle size={13} style={{ flexShrink:0, marginTop:1 }}/>
          <span>GUARD: {g}</span>
        </div>
      ))}

      {/* Agent outputs */}
      {PHASES.map((p,i) => {
        const isActive = phase === i
        const isDone = phase > i
        const hasText = texts[i].length > 0
        if (!isActive && !isDone) return null

        return (
          <div key={p.id}>
            {i > 0 && (
              <div className="handoff-line">
                <ArrowRight size={12}/>
                <span>{PHASES[i-1].label} → {p.label} handoff</span>
              </div>
            )}
            <div className="agent-stream">
              <div className={`agent-tag ${p.tagCls}`}>{p.label} · {p.desc}</div>
              {isActive && thinking && !hasText && (
                <div className="agent-thinking">
                  <div className="blink-dot"/><div className="blink-dot"/><div className="blink-dot"/>
                  <span>reasoning…</span>
                </div>
              )}
              {hasText && <div className="agent-text">{texts[i]}</div>}
            </div>
          </div>
        )
      })}

      {phase === 3 && (
        <div style={{ padding:'12px 24px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:8,height:8,borderRadius:'50%',background:'var(--forest-light)',flexShrink:0 }}/>
          <span style={{ fontFamily:'var(--ff-mono)', fontSize:'0.75rem', color:'rgba(82,183,136,.8)' }}>
            Pride triage complete — officer briefing ready
          </span>
        </div>
      )}
    </div>
  )
}
