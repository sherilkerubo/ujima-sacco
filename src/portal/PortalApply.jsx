import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import CustomerAgentPanel from './CustomerAgentPanel'

const COUNTIES = ['Nairobi','Kakamega','Kisumu','Mombasa','Nakuru','Eldoret','Busia','Kisii','Thika','Nyeri','Machakos','Kilifi']
const OCCS = [
  { val: 'Market vendor',      label: 'Market Vendor',       desc: 'Selling goods at market or roadside' },
  { val: 'Maize farmer',       label: 'Maize Farmer',        desc: 'Growing maize or other crops seasonally' },
  { val: 'Shea butter trader', label: 'Shea Butter Trader',  desc: 'Trading shea or other natural products' },
  { val: 'Boda boda rider',    label: 'Boda Boda Rider',     desc: 'Motorcycle transport services' },
  { val: 'Small tailor',       label: 'Tailor / Seamstress', desc: 'Making or repairing clothing' },
  { val: 'Fish trader',        label: 'Fish Trader',         desc: 'Selling fish or seafood' },
  { val: 'Formal employee',    label: 'Formal Employee',     desc: 'Salaried position with regular payslip' },
  { val: 'Other',              label: 'Other',               desc: 'Another type of work' },
]
const PURPOSES = [
  { val: 'School fees',         label: 'School Fees',          icon: '🎓' },
  { val: 'Business stock',      label: 'Buy Business Stock',   icon: '📦' },
  { val: 'Farm inputs',         label: 'Farm Inputs & Seeds',  icon: '🌱' },
  { val: 'Medical emergency',   label: 'Medical Emergency',    icon: '🏥' },
  { val: 'Equipment purchase',  label: 'Buy Equipment',        icon: '🔧' },
  { val: 'Home improvement',    label: 'Home Improvement',     icon: '🏠' },
]
const STEPS = ['Your Profile', 'Loan Details', 'Your Review', 'AI Evaluation']

export default function PortalApply() {
  const { addLoan } = useApp()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loanId, setLoanId] = useState(null)
  const [agentOutcome, setAgentOutcome] = useState(null)

  const [form, setForm] = useState({
    name: '', phone: '', age: '', county: 'Nairobi',
    occ: '', income: '', harvest: '',
    amount: '', purpose: '', term: '6', children: '0',
    collateral: '', notes: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const step0Valid = form.name && form.phone && form.age && form.county && form.occ && form.income && form.harvest !== ''
  const step1Valid = form.amount && form.purpose && Number(form.amount) >= 1000
  const amtNum = Number(form.amount) || 0

  const handleSubmit = () => {
    const initials = form.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const loan = addLoan({
      ...form,
      initials,
      agentRun: true,
      score: null,
      status: 'pending',
      source: 'customer-portal',
    })
    setLoanId(loan.id)
    setSubmitted(true)
    setStep(3)
  }

  const handleOutcome = (outcome, score) => {
    setAgentOutcome(outcome)
    // Update loan with agent score
  }

  const stepClass = (i) => {
    if (i === step) return 'active'
    if (i < step) return 'done'
    return ''
  }

  return (
    <div className="portal-content">
      {/* Steps */}
      <div className="portal-steps">
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div className={`portal-step ${stepClass(i)}`}>
              <div className="portal-step-num">
                {i < step ? <Check size={15} /> : i + 1}
              </div>
              <span className="portal-step-label">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`portal-step-line${i < step ? ' done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* ─── Step 0: Profile ─── */}
      {step === 0 && (
        <div className="portal-card" style={{ animation: 'portalFadeUp .3s ease' }}>
          <div className="portal-card-title">Tell us about yourself</div>
          <div className="portal-card-sub">This helps our agents give you a fair and personalised evaluation.</div>

          <div className="portal-form-grid">
            <div className="portal-field">
              <label className="portal-label">Full Name</label>
              <input className="portal-input" placeholder="e.g. Grace Achieng" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="portal-field">
              <label className="portal-label">Phone Number</label>
              <input className="portal-input" type="tel" placeholder="+254 712 345 678" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="portal-field">
              <label className="portal-label">Your Age</label>
              <input className="portal-input" type="number" min="18" max="80" placeholder="e.g. 34" value={form.age} onChange={e => set('age', e.target.value)} />
            </div>
            <div className="portal-field">
              <label className="portal-label">County</label>
              <select className="portal-input" value={form.county} onChange={e => set('county', e.target.value)}>
                {COUNTIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="portal-field portal-form-full">
              <label className="portal-label">What do you do for work?</label>
              <div className="portal-choices">
                {OCCS.map(o => (
                  <div key={o.val} className={`portal-choice ${form.occ === o.val ? 'selected' : ''}`} onClick={() => set('occ', o.val)}>
                    <div className="portal-choice-radio">
                      <div className="portal-choice-radio-dot" />
                    </div>
                    <div>
                      <div className="portal-choice-title">{o.label}</div>
                      <div className="portal-choice-desc">{o.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="portal-field portal-form-full">
              <label className="portal-label">Monthly Income (approximate)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { val: 'low',    label: 'Under KES 10,000' },
                  { val: 'mid',    label: 'KES 10,000 – 30,000' },
                  { val: 'high',   label: 'KES 30,000 – 60,000' },
                  { val: 'formal', label: 'KES 60,000+ (formal job)' },
                ].map(opt => (
                  <div key={opt.val} className={`portal-choice ${form.income === opt.val ? 'selected' : ''}`} onClick={() => set('income', opt.val)} style={{ padding: '12px 16px' }}>
                    <div className="portal-choice-radio">
                      <div className="portal-choice-radio-dot" />
                    </div>
                    <div className="portal-choice-title" style={{ fontSize: '0.88rem' }}>{opt.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="portal-field">
              <label className="portal-label">Children under 5</label>
              <select className="portal-input" value={form.children} onChange={e => set('children', e.target.value)}>
                {['0','1','2','3','4','5+'].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="portal-field">
              <label className="portal-label">
                Seasonal income?
                <span className="portal-label-hint">(harvest, planting, etc.)</span>
              </label>
              <div className="portal-choices" style={{ gap: 8 }}>
                {[
                  { val: 'yes', label: 'Yes — my income changes with seasons' },
                  { val: 'no',  label: 'No — I earn steadily each month' },
                ].map(opt => (
                  <div key={opt.val} className={`portal-choice ${form.harvest === opt.val ? 'selected' : ''}`} onClick={() => set('harvest', opt.val)} style={{ padding: '11px 14px' }}>
                    <div className="portal-choice-radio">
                      <div className="portal-choice-radio-dot" />
                    </div>
                    <div className="portal-choice-title" style={{ fontSize: '0.88rem' }}>{opt.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="portal-btn-row">
            <button className="portal-btn primary full lg" disabled={!step0Valid} onClick={() => setStep(1)}>
              Continue <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 1: Loan Details ─── */}
      {step === 1 && (
        <div className="portal-card" style={{ animation: 'portalFadeUp .3s ease' }}>
          <div className="portal-card-title">About your loan</div>
          <div className="portal-card-sub">Tell us how much you need and what it's for. Be as specific as you can — it helps our agents.</div>

          <div className="portal-form-grid">
            <div className="portal-field portal-form-full">
              <label className="portal-label">What do you need the loan for?</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {PURPOSES.map(p => (
                  <div
                    key={p.val}
                    className={`portal-choice ${form.purpose === p.val ? 'selected' : ''}`}
                    onClick={() => set('purpose', p.val)}
                    style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 12px', gap: 8 }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>{p.icon}</span>
                    <div className="portal-choice-title" style={{ fontSize: '0.84rem' }}>{p.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="portal-field portal-form-full">
              <label className="portal-label">How much do you need? (KES)</label>
              <div className="portal-input-prefix">
                <span className="portal-input-prefix-label">KES</span>
                <input
                  className="portal-input"
                  type="number"
                  min="1000"
                  placeholder="e.g. 15,000"
                  value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                />
              </div>
              {amtNum > 0 && amtNum < 5000 && <p className="portal-hint warn">Minimum loan amount is KES 5,000</p>}
              {amtNum >= 5000 && amtNum <= 15000 && <p className="portal-hint good">✓ Great — this amount is within our fast-approval range</p>}
              {amtNum > 15000 && amtNum <= 50000 && <p className="portal-hint">This will be reviewed by Guardian and a human officer</p>}
              {amtNum > 50000 && <p className="portal-hint warn">⚠ Amounts over KES 50,000 require senior officer approval</p>}
            </div>

            <div className="portal-field">
              <label className="portal-label">Repayment period</label>
              <select className="portal-input" value={form.term} onChange={e => set('term', e.target.value)}>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="18">18 months</option>
                <option value="24">24 months</option>
              </select>
              {form.harvest === 'yes' && (
                <p className="portal-hint good">💡 Tip: seasonal farmers often do better with 6–12 month terms aligned to harvest</p>
              )}
            </div>

            <div className="portal-field">
              <label className="portal-label">Collateral (optional)</label>
              <input className="portal-input" placeholder="e.g. Title deed, motorbike, livestock" value={form.collateral} onChange={e => set('collateral', e.target.value)} />
              <p className="portal-hint">Having collateral can improve your chances but is not required for smaller loans</p>
            </div>

            <div className="portal-field portal-form-full">
              <label className="portal-label">Anything else we should know?</label>
              <textarea className="portal-input" rows={3} placeholder="e.g. My maize harvest is in October, so I can pay a larger last instalment..." value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <div className="portal-btn-row">
            <button className="portal-btn ghost" onClick={() => setStep(0)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="portal-btn primary" style={{ flex: 1 }} disabled={!step1Valid || amtNum < 5000} onClick={() => setStep(2)}>
              Review Application <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 2: Review ─── */}
      {step === 2 && (
        <div style={{ animation: 'portalFadeUp .3s ease' }}>
          <div className="portal-card">
            <div className="portal-card-title">Review your application</div>
            <div className="portal-card-sub">Check everything is correct before our agents evaluate it.</div>

            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--p-ink-mute)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>About You</p>
            {[
              ['Name', form.name],
              ['Phone', form.phone],
              ['Age', `${form.age} years old`],
              ['County', form.county],
              ['Occupation', form.occ],
              ['Monthly Income', { low:'Under KES 10,000', mid:'KES 10–30,000', high:'KES 30–60,000', formal:'KES 60,000+' }[form.income]],
              ['Children under 5', form.children],
              ['Seasonal income', form.harvest === 'yes' ? 'Yes' : 'No'],
            ].map(([k, v]) => (
              <div key={k} className="portal-review-row">
                <span className="portal-review-key">{k}</span>
                <span className="portal-review-val">{v}</span>
              </div>
            ))}

            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--p-ink-mute)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '20px 0 12px' }}>Loan Details</p>
            {[
              ['Amount', `KES ${Number(form.amount).toLocaleString()}`],
              ['Purpose', form.purpose],
              ['Term', `${form.term} months`],
              ['Collateral', form.collateral || 'None'],
            ].map(([k, v]) => (
              <div key={k} className="portal-review-row">
                <span className="portal-review-key">{k}</span>
                <span className="portal-review-val">{v}</span>
              </div>
            ))}
            {form.notes && (
              <div style={{ marginTop: 14, padding: '12px 16px', background: 'var(--p-paper-warm)', borderRadius: 10, fontSize: '0.85rem', color: 'var(--p-ink-soft)', lineHeight: 1.6 }}>
                <span style={{ fontWeight: 700 }}>Your note: </span>{form.notes}
              </div>
            )}
          </div>

          <div style={{ padding: '16px 20px', background: 'var(--p-forest-pale)', borderRadius: 14, display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
            <Zap size={18} color="var(--p-forest)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--p-forest)', marginBottom: 3 }}>What happens next?</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--p-forest-mid)', lineHeight: 1.6 }}>
                After you submit, you'll watch our three AI agents — Scout, Guardian, and Hunter — evaluate your application live on screen. The process takes about 60 seconds.
              </p>
            </div>
          </div>

          <div className="portal-btn-row">
            <button className="portal-btn ghost" onClick={() => setStep(1)}>
              <ArrowLeft size={16} /> Edit
            </button>
            <button className="portal-btn gold lg" style={{ flex: 1 }} onClick={handleSubmit}>
              Submit & Start Evaluation <Zap size={17} />
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 3: Agent Evaluation ─── */}
      {step === 3 && (
        <div style={{ animation: 'portalFadeUp .3s ease' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--p-forest-pale)', padding: '6px 14px', borderRadius: 100, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--p-forest-mid)', animation: agentOutcome ? 'none' : 'portalPulse 1.3s ease-in-out infinite' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--p-forest)' }}>
                {agentOutcome ? 'Evaluation complete' : 'Agents are reviewing your application…'}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--p-ff-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: 6 }}>
              {form.name.split(' ')[0]}, your agents are on it 🦁
            </h2>
            <p style={{ color: 'var(--p-ink-soft)', fontSize: '0.9rem' }}>
              Application <span style={{ fontFamily: 'var(--p-ff-mono)', fontWeight: 500 }}>{loanId}</span> submitted — read along as our agents evaluate you.
            </p>
          </div>

          <CustomerAgentPanel application={form} onOutcome={handleOutcome} />

          {agentOutcome && (
            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <button className="portal-btn ghost" style={{ flex: 1 }} onClick={() => window.location.href = '/portal/my-applications'}>
                Track My Application
              </button>
              <button className="portal-btn primary" style={{ flex: 1 }} onClick={() => { setStep(0); setSubmitted(false); setAgentOutcome(null); setForm({ name:'',phone:'',age:'',county:'Nairobi',occ:'',income:'',harvest:'',amount:'',purpose:'',term:'6',children:'0',collateral:'',notes:'' }) }}>
                Apply for Another Loan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
