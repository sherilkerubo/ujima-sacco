import { useEffect, useRef, useState } from 'react'
import { runScout, runGuardian, runHunter } from '../services/agents'
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react'

const AGENTS = [
  {
    id: 'scout',
    name: 'Scout',
    role: 'Financial Coach',
    emoji: '📡',
    bg: 'rgba(82,183,136,.12)',
    nameCls: 'scout',
    nameColor: '#52b788',
  },
  {
    id: 'guardian',
    name: 'Guardian',
    role: 'Loan Reviewer',
    emoji: '🛡️',
    bg: 'rgba(125,211,252,.1)',
    nameCls: 'guardian',
    nameColor: '#7dd3fc',
  },
  {
    id: 'hunter',
    name: 'Hunter',
    role: 'Officer Coordinator',
    emoji: '🦁',
    bg: 'rgba(233,160,26,.12)',
    nameCls: 'hunter',
    nameColor: '#e9a01a',
  },
]

function stepState(phaseIdx, agentIdx) {
  if (phaseIdx > agentIdx) return 'done'
  if (phaseIdx === agentIdx) return 'active'
  return ''
}

export default function CustomerAgentPanel({ application, onOutcome }) {
  const [phase, setPhase] = useState(0)
  const [texts, setTexts] = useState(['', '', ''])
  const [thinking, setThinking] = useState([false, false, false])
  const [guards, setGuards] = useState([])
  const [outcome, setOutcome] = useState(null)
  const ran = useRef(false)
  const feedRef = useRef(null)

  const amt = Number(application.amount) || 0
  const kids = Number(application.children) || 0

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    runAll()
  }, [])

  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [texts, thinking])

  async function runAll() {
    // Detect guard triggers
    const g = []
    if (application.county === 'Busia') g.push('Your application is from Busia County — a human officer will also personally review it.')
    if (amt > 50000) g.push('Loan amounts above KES 50,000 require an additional senior officer check.')
    if (kids >= 2) g.push('Families with young children receive extra care — a human welfare check is included.')
    if (application.purpose === 'Medical emergency') g.push('Medical emergency applications are fast-tracked for urgent review.')
    setGuards(g)

    try {
      // SCOUT
      setPhase(0)
      setThinking([true, false, false])
      const scoutOut = await runScout(application, t => {
        setThinking([false, false, false])
        setTexts(prev => { const n = [...prev]; n[0] = t; return n })
      })

      // GUARDIAN
      setPhase(1)
      setThinking([false, true, false])
      await pause(700)
      const guardOut = await runGuardian(application, scoutOut, t => {
        setThinking([false, false, false])
        setTexts(prev => { const n = [...prev]; n[1] = t; return n })
      })

      // HUNTER
      setPhase(2)
      setThinking([false, false, true])
      await pause(700)
      await runHunter(application, guardOut, t => {
        setThinking([false, false, false])
        setTexts(prev => { const n = [...prev]; n[2] = t; return n })
      })

      // Determine outcome
      const out = amt <= 15000 && kids < 2 && application.county !== 'Busia'
        ? 'approved'
        : amt > 50000 || application.purpose === 'Medical emergency'
        ? 'review'
        : 'escalated'

      setPhase(3)
      setOutcome(out)
      if (onOutcome) onOutcome(out, amt <= 15000 ? Math.floor(Math.random()*12)+82 : Math.floor(Math.random()*20)+62)

    } catch (err) {
      setThinking([false, false, false])
      setTexts(prev => { const n = [...prev]; n[phase] = '[ Agent temporarily unavailable — please try again ]'; return n })
    }
  }

  const pause = ms => new Promise(r => setTimeout(r, ms))

  const OUTCOME_CFG = {
    approved: {
      cls: 'approved', icon: '✅',
      title: 'Great news — your loan looks good!',
      desc: 'Our agents have reviewed your application and it meets our criteria. A loan officer will confirm and reach out within 1 business day.',
    },
    escalated: {
      cls: 'escalated', icon: '📋',
      title: 'Your application is moving to a human officer',
      desc: 'Our Guardian agent has passed your file to one of our experienced officers who specialises in your area. You\'ll hear back within 15 minutes during business hours.',
    },
    review: {
      cls: 'review', icon: '⏳',
      title: 'Additional review required',
      desc: 'Your application needs a closer look from our senior team. This usually takes 1–2 business hours. We\'ll contact you on the phone number you provided.',
    },
  }

  return (
    <div className="portal-agent-wrap">
      {/* Terminal header */}
      <div className="portal-agent-header">
        <div className="portal-traffic-dot" style={{ background: '#ff5f57' }} />
        <div className="portal-traffic-dot" style={{ background: '#febc2e' }} />
        <div className="portal-traffic-dot" style={{ background: phase < 3 ? '#52b788' : '#1a6b3c', animation: phase < 3 ? 'portalPulse 1.3s ease-in-out infinite' : 'none' }} />
        <span className="portal-agent-title">
          ujima-agent-pride — {phase < 3 ? `${AGENTS[Math.min(phase,2)].name} is evaluating…` : 'evaluation complete ✓'}
        </span>
      </div>

      {/* Agent progress steps */}
      <div className="portal-agent-progress">
        {AGENTS.map((a, i) => (
          <div key={a.id} className={`portal-agent-step ${stepState(phase, i)}`}>
            <div className="portal-agent-step-icon">{a.emoji}</div>
            <div className="portal-agent-step-name">{a.name}</div>
          </div>
        ))}
      </div>

      {/* GUARD notices for customers */}
      {guards.map((g, i) => (
        <div key={i} className="portal-guard warn">
          <AlertTriangle size={15} color="var(--p-gold)" style={{ flexShrink: 0, marginTop: 1 }} />
          <span className="portal-guard-text">{g}</span>
        </div>
      ))}

      {/* Message feed */}
      <div className="portal-agent-feed" ref={feedRef} style={{ maxHeight: 420, overflowY: 'auto' }}>
        {AGENTS.map((agent, i) => {
          const isActive = phase === i
          const isDone = phase > i
          const text = texts[i]
          const isThinking = thinking[i]
          if (!isActive && !isDone) return null

          return (
            <div key={agent.id} className="portal-agent-msg">
              <div className="portal-agent-avatar" style={{ background: agent.bg }}>
                {agent.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div className="portal-agent-bubble" style={{ background: agent.bg }}>
                  <div className="portal-agent-bubble-name" style={{ color: agent.nameColor }}>
                    {agent.name} · {agent.role}
                  </div>
                  {isThinking && !text ? (
                    <div className="portal-agent-thinking">
                      <div className="portal-blink" />
                      <div className="portal-blink" />
                      <div className="portal-blink" />
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(255,255,255,.88)', whiteSpace: 'pre-wrap' }}>
                      {text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Outcome */}
      {outcome && OUTCOME_CFG[outcome] && (
        <div className={`portal-outcome ${OUTCOME_CFG[outcome].cls}`}>
          <div className="portal-outcome-icon">{OUTCOME_CFG[outcome].icon}</div>
          <div>
            <div className="portal-outcome-title">{OUTCOME_CFG[outcome].title}</div>
            <div className="portal-outcome-desc">{OUTCOME_CFG[outcome].desc}</div>
          </div>
        </div>
      )}
    </div>
  )
}
