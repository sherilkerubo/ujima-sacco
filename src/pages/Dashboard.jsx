import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, ArrowRight, ExternalLink, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const fmt = (n) => `KES ${Number(n).toLocaleString()}`
const STATUS_CFG = {
  approved: { cls: 'badge-green', label: 'Approved' },
  pending:  { cls: 'badge-gold',  label: 'Pending' },
  review:   { cls: 'badge-earth', label: 'Under Review' },
  rejected: { cls: 'badge-red',   label: 'Rejected' },
}

export default function Dashboard() {
  const { loans } = useApp()
  const total = loans.reduce((s, l) => s + Number(l.amount), 0)
  const approved = loans.filter(l => l.status === 'approved')
  const pending = loans.filter(l => l.status === 'pending' || l.status === 'review')
  const agentRun = loans.filter(l => l.agentRun)

  return (
    <div className="page-wrap fade-in">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32 }}>
        <div>
          <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--ink-mute)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>
            January 2025
          </p>
          <h1 className="page-title">Good morning, Sarah 🌿</h1>
          <p className="page-subtitle">Here's your SACCO portfolio at a glance</p>
        </div>
        <Link to="/apply" className="btn btn-primary">
          <span>+ New Application</span>
        </Link>
      </div>

      {/* Customer portal banner */}
      <div style={{ marginBottom: 28, padding: '18px 24px', background: 'linear-gradient(135deg, var(--forest) 0%, #1f6b45 100%)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--r-md)', background: 'rgba(233,160,26,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🦁</div>
          <div>
            <p style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, color: 'var(--white)', fontSize: '0.95rem', marginBottom: 2 }}>Customer Self-Service Portal</p>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '0.8rem' }}>Members apply directly — agents evaluate without officer involvement</p>
          </div>
        </div>
        <Link to="/portal" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'var(--gold)', color: 'var(--ink)', borderRadius: 'var(--r-md)', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>
          <ExternalLink size={15}/> Open Customer Portal
        </Link>
      </div>

      {/* Metrics */}
      <div className="metric-grid">
        <div className="metric-card gold">
          <div className="metric-label">Portfolio Value</div>
          <div className="metric-value">{fmt(total)}</div>
          <div className="metric-sub">
            <span className="metric-trend up"><TrendingUp size={12}/> +12% vs last month</span>
          </div>
        </div>
        <div className="metric-card forest">
          <div className="metric-label">Active Loans</div>
          <div className="metric-value">{approved.length}</div>
          <div className="metric-sub">
            <span className="metric-trend up"><TrendingUp size={12}/> 94% repayment rate</span>
          </div>
        </div>
        <div className="metric-card earth">
          <div className="metric-label">Awaiting Review</div>
          <div className="metric-value">{pending.length}</div>
          <div className="metric-sub" style={{ color:'var(--earth)' }}>
            <span className="metric-trend"><Clock size={12}/> {pending.length} need attention</span>
          </div>
        </div>
        <div className="metric-card info">
          <div className="metric-label">Agent-Triaged</div>
          <div className="metric-value">{agentRun.length}</div>
          <div className="metric-sub">
            <span className="metric-trend up"><TrendingUp size={12}/> 67% of all apps</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:32 }}>
        {[
          { icon:<CheckCircle size={20}/>, title:'Approve pending', desc:`${pending.length} applications waiting`, color:'var(--forest)', link:'/applications' },
          { icon:<AlertTriangle size={20}/>, title:'Busia County flag', desc:'1 mandatory review', color:'var(--earth)', link:'/applications' },
          { icon:<TrendingDown size={20}/>, title:'Harvest season', desc:'Oct/Nov disbursements due', color:'var(--info)', link:'/reports' },
        ].map((q,i) => (
          <Link key={i} to={q.link} style={{ textDecoration:'none' }}>
            <div className="card card-sm" style={{ display:'flex', gap:14, alignItems:'center', cursor:'pointer', transition:'box-shadow .15s' }}
              onMouseOver={e=>e.currentTarget.style.boxShadow='var(--shadow-md)'}
              onMouseOut={e=>e.currentTarget.style.boxShadow='none'}>
              <div style={{ width:40,height:40,borderRadius:'var(--r-md)',background:'var(--paper-warm)',display:'flex',alignItems:'center',justifyContent:'center',color:q.color,flexShrink:0 }}>{q.icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:'0.88rem' }}>{q.title}</div>
                <div style={{ fontSize:'0.75rem', color:'var(--ink-soft)' }}>{q.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent applications */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <h2 className="section-head" style={{ marginBottom:0 }}>Recent Applications</h2>
        <Link to="/applications" className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:5 }}>
          View all <ArrowRight size={14}/>
        </Link>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Occupation</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>AI Score</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loans.slice(0,6).map(loan => {
              const s = STATUS_CFG[loan.status] || STATUS_CFG.pending
              return (
                <tr key={loan.id} style={{ cursor:'pointer' }}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="loan-avatar" style={{ width:32,height:32,fontSize:'0.78rem' }}>{loan.initials}</div>
                      <div>
                        <div className="name-cell">{loan.name}</div>
                        <div className="mono">{loan.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color:'var(--ink-soft)', fontSize:'0.82rem' }}>{loan.occ}</td>
                  <td><span style={{ fontFamily:'var(--ff-display)', fontWeight:700 }}>{fmt(loan.amount)}</span></td>
                  <td style={{ fontSize:'0.82rem' }}>{loan.purpose}</td>
                  <td>
                    {loan.score
                      ? <div>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:'0.75rem', fontWeight:700 }}>
                            <span style={{ color: loan.score>=80?'var(--forest-mid)':loan.score>=60?'var(--gold-deep)':'var(--danger)' }}>{loan.score}</span>
                          </div>
                          <div className="progress-bar" style={{ width:80 }}>
                            <div className={`progress-fill ${loan.score>=80?'green':loan.score>=60?'gold':'red'}`} style={{ width:`${loan.score}%` }}/>
                          </div>
                        </div>
                      : <span style={{ color:'var(--ink-mute)', fontSize:'0.8rem' }}>Pending</span>
                    }
                  </td>
                  <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                  <td style={{ color:'var(--ink-mute)', fontSize:'0.8rem' }}>{loan.date}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* SDG footer */}
      <div style={{ marginTop:32, padding:'18px 22px', background:'var(--forest-pale)', borderRadius:'var(--r-lg)', display:'flex', gap:16, alignItems:'center' }}>
        <div style={{ fontSize:'1.8rem' }}>🌍</div>
        <div>
          <div style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--forest)', marginBottom:2 }}>SDG Impact Tracker</div>
          <div style={{ fontSize:'0.8rem', color:'var(--forest-mid)' }}>
            This portfolio contributes to <strong>SDG 1</strong> (No Poverty), <strong>SDG 5</strong> (Gender Equality), and <strong>SDG 8</strong> (Decent Work) — 68% of approved loans went to women informal traders.
          </div>
        </div>
      </div>
    </div>
  )
}
