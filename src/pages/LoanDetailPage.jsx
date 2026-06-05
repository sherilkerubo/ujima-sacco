import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bot, Check, AlertTriangle, Calendar, MapPin, User, Briefcase } from 'lucide-react'
import { useApp } from '../context/AppContext'
import AgentPanel from '../components/agents/AgentPanel'

const fmt = n => `KES ${Number(n).toLocaleString()}`
const INCOME_LABELS = { low:'Under KES 10,000/mo', mid:'KES 10–30,000/mo', high:'KES 30–60,000/mo', formal:'KES 60,000+/mo (formal)' }
const STATUS_CFG = {
  approved: { cls:'badge-green', label:'Approved', color:'var(--forest)' },
  pending:  { cls:'badge-gold',  label:'Pending',  color:'var(--gold-deep)' },
  review:   { cls:'badge-earth', label:'Under Review', color:'var(--earth)' },
  rejected: { cls:'badge-red',   label:'Rejected', color:'var(--danger)' },
}

export default function LoanDetailPage() {
  const { id } = useParams()
  const { loans, updateLoan, showToast } = useApp()
  const navigate = useNavigate()
  const loan = loans.find(l => l.id === id)
  const [showAgent, setShowAgent] = useState(false)

  if (!loan) return (
    <div className="page-wrap" style={{ textAlign:'center', paddingTop:80 }}>
      <p style={{ color:'var(--ink-mute)' }}>Application not found.</p>
      <button className="btn btn-ghost" style={{ marginTop:16 }} onClick={()=>navigate('/applications')}>Back to applications</button>
    </div>
  )

  const s = STATUS_CFG[loan.status] || STATUS_CFG.pending
  const flags = []
  if (loan.county === 'Busia') flags.push('Busia County — mandatory human review')
  if (Number(loan.children)>=2) flags.push('2+ children under 5 — welfare consideration')
  if (Number(loan.amount)>50000) flags.push('High-value loan — senior officer approval required')
  if (loan.purpose === 'Medical emergency') flags.push('Medical emergency — expedited review')

  const approve = () => { updateLoan(id, { status:'approved', score:(loan.score||72) }); showToast('Loan approved') }
  const reject  = () => { updateLoan(id, { status:'rejected' }); showToast('Application rejected') }

  return (
    <div className="page-wrap fade-in">
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <button className="btn btn-ghost btn-sm" style={{ marginBottom:20 }} onClick={()=>navigate('/applications')}>
          <ArrowLeft size={14}/> All Applications
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <div className="loan-avatar" style={{ width:52, height:52, fontSize:'1.1rem', borderRadius:'var(--r-lg)' }}>{loan.initials}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <h1 className="page-title" style={{ fontSize:'1.6rem' }}>{loan.name}</h1>
              <span className={`badge ${s.cls}`}>{s.label}</span>
              {loan.agentRun && <span className="badge badge-info"><Bot size={10}/> AI-triaged</span>}
            </div>
            <p className="page-subtitle">{loan.id} · Applied {loan.date}</p>
          </div>
          {(loan.status==='pending'||loan.status==='review') && (
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-primary" onClick={approve}><Check size={15}/> Approve</button>
              <button className="btn btn-danger" onClick={reject}>Reject</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: showAgent ? '1fr 1fr' : '3fr 1fr', gap:24, alignItems:'start' }}>
        {/* Main details */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Loan summary card */}
          <div className="card card-pad" style={{ background:'var(--forest)', color:'var(--white)', borderColor:'transparent' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(255,255,255,.55)', marginBottom:6 }}>Loan Amount</p>
                <p style={{ fontFamily:'var(--ff-display)', fontSize:'2.4rem', fontWeight:700, lineHeight:1 }}>{fmt(loan.amount)}</p>
                <p style={{ color:'rgba(255,255,255,.6)', fontSize:'0.85rem', marginTop:6 }}>{loan.purpose} · {loan.term||6} months</p>
              </div>
              {loan.score && (
                <div style={{ textAlign:'center' }}>
                  <div style={{ width:64, height:64, borderRadius:'50%', border:`3px solid ${loan.score>=80?'#52b788':loan.score>=60?'var(--gold)':'#ff6b6b'}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontFamily:'var(--ff-display)', fontSize:'1.2rem', fontWeight:700 }}>{loan.score}</span>
                    <span style={{ fontSize:'0.6rem', color:'rgba(255,255,255,.5)', textTransform:'uppercase' }}>score</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GUARD flags */}
          {flags.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {flags.map((f,i) => (
                <div key={i} style={{ display:'flex', gap:10, padding:'10px 14px', background:'var(--danger-pale)', borderRadius:'var(--r-md)', fontSize:'0.82rem', color:'var(--danger)', alignItems:'center' }}>
                  <AlertTriangle size={14} style={{ flexShrink:0 }}/>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}

          {/* Profile */}
          <div className="card card-pad">
            <h3 className="section-head" style={{ fontSize:'1rem', marginBottom:16 }}>Applicant Profile</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {[
                { icon:<User size={15}/>, label:'Name', value:loan.name },
                { icon:<Calendar size={15}/>, label:'Age', value:`${loan.age} years old` },
                { icon:<Briefcase size={15}/>, label:'Occupation', value:loan.occ },
                { icon:<MapPin size={15}/>, label:'County', value:loan.county },
                { label:'Monthly Income', value:INCOME_LABELS[loan.income] || loan.income },
                { label:'Children Under 5', value:loan.children || '0' },
                { label:'Harvest Applicant', value:loan.harvest==='yes'||loan.harvest===true ? 'Yes — seasonal income' : 'No' },
                { label:'Collateral', value:loan.collateral || 'None provided' },
              ].map((item,i) => (
                <div key={i} style={{ padding:'10px 0', borderBottom:'1px solid var(--paper-warm)' }}>
                  <p style={{ fontSize:'0.72rem', color:'var(--ink-mute)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{item.label}</p>
                  <p style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--ink)', display:'flex', alignItems:'center', gap:6 }}>
                    {item.icon && <span style={{ color:'var(--ink-mute)' }}>{item.icon}</span>}
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            {loan.notes && (
              <div style={{ marginTop:16, padding:'12px 14px', background:'var(--paper-warm)', borderRadius:'var(--r-md)' }}>
                <p style={{ fontSize:'0.75rem', color:'var(--ink-mute)', fontWeight:700, marginBottom:4 }}>OFFICER NOTES</p>
                <p style={{ fontSize:'0.88rem', color:'var(--ink-soft)' }}>{loan.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card card-sm">
            <p style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--ink-mute)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:12 }}>Agent Pride</p>
            {loan.agentRun
              ? <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {['Scout','Guardian','Hunter'].map(a => (
                    <div key={a} style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem' }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--forest-mid)', flexShrink:0 }}/>
                      <span style={{ fontWeight:600 }}>{a}</span>
                      <span style={{ marginLeft:'auto', color:'var(--forest-mid)', fontSize:'0.72rem', fontWeight:700 }}>✓ Done</span>
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop:8 }} onClick={()=>setShowAgent(v=>!v)}>
                    <Bot size={13}/> {showAgent?'Hide':'Re-run'} Agents
                  </button>
                </div>
              : <div>
                  <p style={{ fontSize:'0.82rem', color:'var(--ink-soft)', marginBottom:12 }}>Agent Pride has not triaged this application yet.</p>
                  <button className="btn btn-primary btn-full btn-sm" onClick={()=>setShowAgent(true)}>
                    <Bot size={13}/> Run Agent Pride
                  </button>
                </div>
            }
          </div>

          <div className="card card-sm">
            <p style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--ink-mute)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:12 }}>Timeline</p>
            {[
              { date:loan.date, label:'Application submitted', done:true },
              { date:loan.agentRun?loan.date:null, label:'AI triage', done:loan.agentRun },
              { date:loan.status==='approved'?loan.date:null, label:'Decision made', done:loan.status==='approved'||loan.status==='rejected' },
              { date:null, label:'Disbursement', done:loan.status==='approved' },
            ].map((t,i) => (
              <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ width:18, height:18, borderRadius:'50%', background:t.done?'var(--forest-pale)':'var(--paper-warm)', border:`2px solid ${t.done?'var(--forest-mid)':'var(--paper-dark)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                  {t.done && <Check size={10} color="var(--forest)"/>}
                </div>
                <div>
                  <p style={{ fontSize:'0.82rem', fontWeight:t.done?700:400, color:t.done?'var(--ink)':'var(--ink-mute)' }}>{t.label}</p>
                  {t.date && <p style={{ fontSize:'0.72rem', color:'var(--ink-mute)' }}>{t.date}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent panel shown below when re-running */}
      {showAgent && (
        <div style={{ marginTop:24 }}>
          <AgentPanel application={loan} onComplete={()=>updateLoan(id,{agentRun:true})}/>
        </div>
      )}
    </div>
  )
}
