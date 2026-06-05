import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import AgentPanel from '../components/agents/AgentPanel'

const COUNTIES = ['Nairobi','Kakamega','Kisumu','Mombasa','Nakuru','Eldoret','Busia','Kisii','Thika','Nyeri']
const OCCS = ['Market vendor','Maize farmer','Shea butter trader','Boda boda rider','Formal employee','Small tailor','Fish trader','Vegetable seller','Charcoal dealer','Other']
const PURPOSES = ['School fees','Business stock','Farm inputs','Medical emergency','Equipment purchase','Home improvement','Livestock purchase','Other']

const STEPS = ['Applicant Details','Loan Information','Review & Submit']

export default function ApplyPage() {
  const { addLoan, showToast } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [agentTriggered, setAgentTriggered] = useState(false)
  const [agentDone, setAgentDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name:'', age:'', occ:'Market vendor', county:'Nairobi',
    income:'mid', children:'0', harvest:'yes',
    amount:'', purpose:'School fees', term:'6', collateral:'',
    notes:'',
  })

  const set = (k,v) => setForm(f => ({...f, [k]:v}))

  const step1Valid = form.name && form.age && form.occ && form.county
  const step2Valid = form.amount && form.purpose

  const handleNext = () => {
    if (step === 1 && step2Valid) {
      setAgentTriggered(true)
    }
    setStep(s => Math.min(s+1, 2))
  }

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      const loan = addLoan({
        ...form,
        initials: form.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),
        agentRun: agentDone,
        score: agentDone ? Math.floor(Math.random()*30)+62 : null,
        status: 'pending',
      })
      showToast(`Application ${loan.id} submitted successfully`)
      navigate('/applications')
    }, 800)
  }

  return (
    <div className="page-wrap fade-in">
      <div style={{ marginBottom:32 }}>
        <h1 className="page-title">New Loan Application</h1>
        <p className="page-subtitle">Complete the form — our Agent Pride will triage automatically</p>
      </div>

      {/* Step bar */}
      <div className="step-bar">
        {STEPS.map((label, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 'none' }}>
            <div className={`step ${i===step?'active':i<step?'done':''}`} style={{ flexShrink:0 }}>
              <div className="step-circle">
                {i < step ? <Check size={14}/> : i+1}
              </div>
              <span className="step-label">{label}</span>
            </div>
            {i < STEPS.length-1 && <div className={`step-line${i<step?' done':''}`}/>}
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns: agentTriggered ? '1fr 1fr' : '1fr', gap:28, alignItems:'start' }}>
        {/* Form */}
        <div>
          {/* Step 1 */}
          {step === 0 && (
            <div className="card card-pad fade-in">
              <h2 className="section-head">Applicant Details</h2>
              <div className="form-grid" style={{ gap:18 }}>
                <div className="field">
                  <label className="field-label">Full Name</label>
                  <input className="field-input" placeholder="e.g. Grace Achieng" value={form.name} onChange={e=>set('name',e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Age</label>
                  <input className="field-input" type="number" min="18" max="80" placeholder="e.g. 34" value={form.age} onChange={e=>set('age',e.target.value)}/>
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
                <div className="field form-full">
                  <label className="field-label">Harvest-Cycle Applicant?</label>
                  <select className="field-input" value={form.harvest} onChange={e=>set('harvest',e.target.value)}>
                    <option value="yes">Yes — income tied to harvest seasons</option>
                    <option value="no">No — steady monthly income</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className="card card-pad fade-in">
              <h2 className="section-head">Loan Information</h2>
              <div className="form-grid" style={{ gap:18 }}>
                <div className="field">
                  <label className="field-label">Loan Amount (KES)</label>
                  <input className="field-input" type="number" placeholder="e.g. 28000" value={form.amount} onChange={e=>set('amount',e.target.value)}/>
                  {form.amount && Number(form.amount) > 50000 && (
                    <p className="field-hint" style={{ color:'var(--earth)' }}>⚠ Amounts above KES 50,000 require senior officer review</p>
                  )}
                </div>
                <div className="field">
                  <label className="field-label">Loan Purpose</label>
                  <select className="field-input" value={form.purpose} onChange={e=>set('purpose',e.target.value)}>
                    {PURPOSES.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Repayment Term</label>
                  <select className="field-input" value={form.term} onChange={e=>set('term',e.target.value)}>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="18">18 months</option>
                    <option value="24">24 months</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Collateral (optional)</label>
                  <input className="field-input" placeholder="e.g. Title deed, livestock" value={form.collateral} onChange={e=>set('collateral',e.target.value)}/>
                </div>
                <div className="field form-full">
                  <label className="field-label">Additional Notes</label>
                  <textarea className="field-input" rows={3} placeholder="Any context the loan officer should know..." value={form.notes} onChange={e=>set('notes',e.target.value)} style={{ resize:'vertical' }}/>
                </div>
              </div>

              <div style={{ marginTop:20, padding:'14px 18px', background:'var(--forest-pale)', borderRadius:'var(--r-md)', display:'flex', gap:10, alignItems:'center' }}>
                <Zap size={16} color="var(--forest)"/>
                <p style={{ fontSize:'0.82rem', color:'var(--forest-mid)' }}>
                  <strong>Agent Pride will auto-triage</strong> once you continue — Scout, Guardian, and Hunter agents will analyse this application in real time.
                </p>
              </div>
            </div>
          )}

          {/* Step 3 - Review */}
          {step === 2 && (
            <div className="card card-pad fade-in">
              <h2 className="section-head">Review Application</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  ['Applicant', form.name],
                  ['Age', form.age],
                  ['Occupation', form.occ],
                  ['County', form.county],
                  ['Amount', `KES ${Number(form.amount||0).toLocaleString()}`],
                  ['Purpose', form.purpose],
                  ['Term', `${form.term} months`],
                  ['AI Triage', agentDone ? '✅ Completed' : '⏳ In progress…'],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--paper-warm)' }}>
                    <span style={{ fontSize:'0.82rem', color:'var(--ink-soft)', fontWeight:600 }}>{k}</span>
                    <span style={{ fontSize:'0.88rem', fontWeight:700 }}>{v}</span>
                  </div>
                ))}
              </div>
              {form.county === 'Busia' && (
                <div style={{ marginTop:16, padding:'10px 14px', background:'var(--danger-pale)', borderRadius:'var(--r-md)', fontSize:'0.8rem', color:'var(--danger)', fontWeight:600 }}>
                  ⚑ Busia County — mandatory human review will be assigned
                </div>
              )}
            </div>
          )}

          {/* Nav buttons */}
          <div style={{ display:'flex', gap:12, marginTop:20 }}>
            {step > 0 && (
              <button className="btn btn-ghost" onClick={()=>setStep(s=>s-1)}>
                <ChevronLeft size={16}/> Back
              </button>
            )}
            {step < 2 ? (
              <button
                className="btn btn-primary"
                style={{ flex:1 }}
                disabled={step===0 ? !step1Valid : !step2Valid}
                onClick={handleNext}
              >
                Continue <ChevronRight size={16}/>
              </button>
            ) : (
              <button
                className="btn btn-gold"
                style={{ flex:1 }}
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>

        {/* Agent Panel */}
        {agentTriggered && (
          <AgentPanel
            application={form}
            onComplete={() => setAgentDone(true)}
          />
        )}
      </div>
    </div>
  )
}
