import { useApp } from '../context/AppContext'
import { Search } from 'lucide-react'
import { useState } from 'react'

const fmt = n => `KES ${Number(n).toLocaleString()}`

export default function MembersPage() {
  const { loans } = useApp()
  const [search, setSearch] = useState('')

  const members = loans
    .filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.county.toLowerCase().includes(search.toLowerCase()))
    .map(l => ({
      ...l,
      totalBorrowed: Number(l.amount),
      repaymentRate: l.status === 'approved' ? Math.floor(Math.random()*10)+88 : null,
    }))

  return (
    <div className="page-wrap fade-in">
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-subtitle">{loans.length} registered borrowers</p>
        </div>
      </div>

      <div style={{ position:'relative', marginBottom:24 }}>
        <Search size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--ink-mute)' }}/>
        <input className="field-input" style={{ paddingLeft:38, maxWidth:360 }} placeholder="Search members…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
        {members.map(m => (
          <div key={m.id} className="card card-pad" style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
            <div className="loan-avatar" style={{ width:48, height:48, fontSize:'1rem', flexShrink:0 }}>{m.initials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <p style={{ fontWeight:700, fontSize:'0.95rem' }}>{m.name}</p>
                  <p style={{ fontSize:'0.78rem', color:'var(--ink-soft)' }}>{m.occ} · {m.county}</p>
                </div>
                <span className={`badge ${m.status==='approved'?'badge-green':m.status==='pending'?'badge-gold':'badge-earth'}`} style={{ flexShrink:0 }}>
                  {m.status==='approved'?'Active':m.status==='pending'?'Pending':'Review'}
                </span>
              </div>
              <div className="divider" style={{ margin:'12px 0' }}/>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div>
                  <p style={{ fontSize:'0.7rem', color:'var(--ink-mute)', fontWeight:700, textTransform:'uppercase', marginBottom:2 }}>Loan</p>
                  <p style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:'0.95rem' }}>{fmt(m.totalBorrowed)}</p>
                </div>
                {m.repaymentRate && (
                  <div>
                    <p style={{ fontSize:'0.7rem', color:'var(--ink-mute)', fontWeight:700, textTransform:'uppercase', marginBottom:2 }}>Repayment</p>
                    <p style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:'0.95rem', color:'var(--forest-mid)' }}>{m.repaymentRate}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
