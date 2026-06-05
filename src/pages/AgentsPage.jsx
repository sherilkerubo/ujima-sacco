import { useState } from 'react'
import { Bot, Play, RotateCcw, Shield, Users, Radio } from 'lucide-react'
import AgentPanel from '../components/agents/AgentPanel'

const COUNTIES = ['Nairobi','Kakamega','Kisumu','Mombasa','Nakuru','Eldoret','Busia','Kisii']
const OCCS = ['Market vendor','Maize farmer','Shea butter trader','Boda boda rider','Formal employee','Small tailor','Fish trader']
const PURPOSES = ['School fees','Business stock','Farm inputs','Medical emergency','Equipment purchase','Home improvement']

const PRESETS = [
  { label:'Red team: Busia trader', desc:'Tests bias guardrails', app:{ name:'Amina Hassan', age:'38', occ:'Shea butter trader', county:'Busia', income:'low', children:'4', harvest:'no', amount:'42000', purpose:'Business stock' }},
  { label:'Harvest farmer', desc:'Tests seasonal alignment', app:{ name:'Joseph Mwangi', age:'44', occ:'Maize farmer', county:'Kakamega', income:'mid', children:'1', harvest:'yes', amount:'15000', purpose:'Farm inputs' }},
  { label:'Medical emergency', desc:'Tests escalation triggers', app:{ name:'Grace Achieng', age:'32', occ:'Market vendor', county:'Kisumu', income:'low', children:'2', harvest:'no', amount:'28000', purpose:'Medical emergency' }},
]

export default function AgentsPage() {
  const [form, setForm] = useState({ name:'', age:'', occ:'Market vendor', county:'Nairobi', income:'mid', children:'0', harvest:'yes', amount:'', purpose:'School fees' })
  const [running, setRunning] = useState(false)
  const [key, setKey] = useState(0)

  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const loadPreset = (p) => { setForm(p.app); setRunning(false); }

  const run = () => { setKey(k=>k+1); setRunning(true); }
  const reset = () => { setRunning(false); setForm({ name:'', age:'', occ:'Market vendor', county:'Nairobi', income:'mid', children:'0', harvest:'yes', amount:'', purpose:'School fees' }) }

  const ready = form.name && form.age && form.amount

  return (
    <div className="page-wrap fade-in">
      <div style={{ marginBottom:28 }}>
        <h1 className="page-title">Agent Pride</h1>
        <p className="page-subtitle">Scout → Guardian → Hunter — live AI triage system powered by Claude</p>
      </div>

      {/* Agent cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
        {[
          { icon:<Radio size={20}/>, name:'Scout', desc:'Financial Literacy Coach', limits:'Educates only · Max 3 SMS/day · Never recommends loans', color:'var(--forest-mid)', pale:'var(--forest-pale)' },
          { icon:<Shield size={20}/>, name:'Guardian', desc:'Loan Triage Officer', limits:'Approves ≤ KES 15,000 · Escalates on 2+ risk flags · DIGNITY filter active', color:'var(--info)', pale:'var(--info-pale)' },
          { icon:<Users size={20}/>, name:'Hunter', desc:'Human-in-Loop Coordinator', limits:'NEVER approves/denies · Prepares officer briefings · 15-min SLA', color:'var(--gold-deep)', pale:'var(--gold-light)' },
        ].map(a => (
          <div key={a.name} className="card card-pad">
            <div style={{ width:40,height:40,borderRadius:'var(--r-md)',background:a.pale,display:'flex',alignItems:'center',justifyContent:'center',color:a.color,marginBottom:12 }}>{a.icon}</div>
            <div style={{ fontFamily:'var(--ff-display)', fontSize:'1.05rem', fontWeight:700, marginBottom:2 }}>{a.name}</div>
            <div style={{ fontSize:'0.78rem', color:'var(--ink-soft)', marginBottom:10 }}>{a.desc}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--ink-mute)', lineHeight:1.6, borderTop:'1px solid var(--paper-warm)', paddingTop:10 }}>{a.limits}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns: running ? '1fr 1fr' : '1fr', gap:28, alignItems:'start' }}>
        {/* Form */}
        <div>
          {/* Presets */}
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--ink-mute)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Quick Presets</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {PRESETS.map(p => (
                <button key={p.label} className="btn btn-ghost btn-sm" onClick={()=>loadPreset(p)} title={p.desc}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <h2 className="section-head">Application Details</h2>
            <div className="form-grid" style={{ gap:16, marginBottom:20 }}>
              <div className="field">
                <label className="field-label">Full Name</label>
                <input className="field-input" placeholder="e.g. Grace Achieng" value={form.name} onChange={e=>set('name',e.target.value)}/>
              </div>
              <div className="field">
                <label className="field-label">Age</label>
                <input className="field-input" type="number" min="18" max="80" placeholder="34" value={form.age} onChange={e=>set('age',e.target.value)}/>
              </div>
              <div className="field">
                <label className="field-label">Occupation</label>
                <select className="field-input" value={form.occ} onChange={e=>set('occ',e.target.value)}>
                  {OCCS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">County</label>
                <select className="field-input" value={form.county} onChange={e=>set('county',e.target.value)}>
                  {COUNTIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Monthly Income</label>
                <select className="field-input" value={form.income} onChange={e=>set('income',e.target.value)}>
                  <option value="low">Under KES 10,000</option>
                  <option value="mid">KES 10,000 – 30,000</option>
                  <option value="high">KES 30,000 – 60,000</option>
                  <option value="formal">KES 60,000+ (formal)</option>
                </select>
              </div>
              <div className="field">
                <label className="field-label">Children Under 5</label>
                <input className="field-input" type="number" min="0" max="10" value={form.children} onChange={e=>set('children',e.target.value)}/>
              </div>
              <div className="field">
                <label className="field-label">Loan Amount (KES)</label>
                <input className="field-input" type="number" placeholder="e.g. 28000" value={form.amount} onChange={e=>set('amount',e.target.value)}/>
              </div>
              <div className="field">
                <label className="field-label">Purpose</label>
                <select className="field-input" value={form.purpose} onChange={e=>set('purpose',e.target.value)}>
                  {PURPOSES.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label className="field-label">Harvest-cycle applicant?</label>
                <select className="field-input" value={form.harvest} onChange={e=>set('harvest',e.target.value)}>
                  <option value="yes">Yes — income tied to harvest seasons</option>
                  <option value="no">No — steady monthly income</option>
                </select>
              </div>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-primary" style={{ flex:1 }} disabled={!ready} onClick={run}>
                <Play size={15}/> Run Agent Pride
              </button>
              <button className="btn btn-ghost" onClick={reset}><RotateCcw size={15}/></button>
            </div>
          </div>
        </div>

        {/* Live agent stream */}
        {running && (
          <AgentPanel key={key} application={form} />
        )}
      </div>
    </div>
  )
}
