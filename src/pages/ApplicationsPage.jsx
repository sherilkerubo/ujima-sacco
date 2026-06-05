import { useState } from 'react'
import { Search, Filter, Bot, Eye } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const STATUS_CFG = {
  approved: { cls: 'badge-green', label: 'Approved' },
  pending:  { cls: 'badge-gold',  label: 'Pending' },
  review:   { cls: 'badge-earth', label: 'Under Review' },
  rejected: { cls: 'badge-red',   label: 'Rejected' },
}

const fmt = n => `KES ${Number(n).toLocaleString()}`

export default function ApplicationsPage() {
  const { loans, updateLoan, showToast } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const filtered = loans
    .filter(l => {
      const q = search.toLowerCase()
      const matchSearch = !search || l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.county.toLowerCase().includes(q)
      const matchStatus = filterStatus === 'all' || l.status === filterStatus
      return matchSearch && matchStatus
    })
    .sort((a,b) => {
      if (sortBy === 'amount') return Number(b.amount) - Number(a.amount)
      if (sortBy === 'score') return (b.score||0) - (a.score||0)
      return new Date(b.date) - new Date(a.date)
    })

  const approve = (id, e) => {
    e.stopPropagation()
    updateLoan(id, { status:'approved', score: Math.floor(Math.random()*20)+74 })
    showToast('Loan approved successfully')
  }

  const reject = (id, e) => {
    e.stopPropagation()
    updateLoan(id, { status:'rejected' })
    showToast('Application rejected — notification sent to member', 'error')
  }

  const pending = loans.filter(l => l.status==='pending' || l.status==='review').length

  return (
    <div className="page-wrap fade-in">
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">{loans.length} total · {pending} awaiting decision</p>
        </div>
        <button className="btn btn-primary" onClick={()=>navigate('/apply')}>+ New Application</button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:200, position:'relative' }}>
          <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--ink-mute)' }}/>
          <input
            className="field-input"
            style={{ paddingLeft:36 }}
            placeholder="Search by name, ID, county…"
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {['all','pending','review','approved','rejected'].map(s => (
            <button
              key={s}
              className={`btn btn-sm ${filterStatus===s?'btn-primary':'btn-ghost'}`}
              onClick={()=>setFilterStatus(s)}
            >
              {s === 'all' ? 'All' : STATUS_CFG[s]?.label || s}
            </button>
          ))}
        </div>
        <select className="field-input" style={{ width:'auto' }} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
          <option value="score">Sort: AI Score</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow:'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Occupation / County</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>AI Score</th>
              <th>Flags</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign:'center', color:'var(--ink-mute)', padding:40 }}>No applications found</td></tr>
            )}
            {filtered.map(loan => {
              const s = STATUS_CFG[loan.status] || STATUS_CFG.pending
              const isActionable = loan.status === 'pending' || loan.status === 'review'
              const flags = []
              if (loan.county === 'Busia') flags.push({ label:'Busia', cls:'badge-earth' })
              if (Number(loan.children)>=2) flags.push({ label:'2+ children', cls:'badge-gold' })
              if (Number(loan.amount)>50000) flags.push({ label:'High value', cls:'badge-red' })

              return (
                <tr key={loan.id} style={{ cursor:'pointer' }} onClick={()=>navigate(`/applications/${loan.id}`)}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="loan-avatar" style={{ width:36, height:36, fontSize:'0.82rem' }}>{loan.initials}</div>
                      <div>
                        <div className="name-cell" style={{ fontSize:'0.9rem' }}>{loan.name}</div>
                        <div className="mono">{loan.id} {loan.agentRun && <span title="AI-triaged" style={{ color:'var(--forest-light)' }}>• AI</span>}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize:'0.84rem' }}>{loan.occ}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--ink-mute)' }}>{loan.county}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily:'var(--ff-display)', fontWeight:700 }}>{fmt(loan.amount)}</span>
                  </td>
                  <td style={{ fontSize:'0.84rem' }}>{loan.purpose}</td>
                  <td>
                    {loan.score
                      ? <div>
                          <div style={{ fontFamily:'var(--ff-mono)', fontSize:'0.85rem', fontWeight:500, color:loan.score>=80?'var(--forest-mid)':loan.score>=60?'var(--gold-deep)':'var(--danger)', marginBottom:4 }}>{loan.score}/100</div>
                          <div className="progress-bar" style={{ width:70 }}>
                            <div className={`progress-fill ${loan.score>=80?'green':loan.score>=60?'gold':'red'}`} style={{ width:`${loan.score}%` }}/>
                          </div>
                        </div>
                      : <span style={{ fontSize:'0.78rem', color:'var(--ink-mute)' }}>—</span>
                    }
                  </td>
                  <td>
                    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      {flags.map((f,i) => <span key={i} className={`badge ${f.cls}`}>{f.label}</span>)}
                      {flags.length === 0 && <span style={{ color:'var(--ink-mute)', fontSize:'0.78rem' }}>None</span>}
                    </div>
                  </td>
                  <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }} onClick={e=>e.stopPropagation()}>
                      {isActionable && (
                        <>
                          <button className="btn btn-sm" style={{ background:'var(--forest-pale)', color:'var(--forest)', border:'none' }} onClick={e=>approve(loan.id,e)}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={e=>reject(loan.id,e)}>Reject</button>
                        </>
                      )}
                      <button className="btn btn-sm btn-ghost" onClick={e=>{e.stopPropagation();navigate(`/applications/${loan.id}`)}} title="View details">
                        <Eye size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
