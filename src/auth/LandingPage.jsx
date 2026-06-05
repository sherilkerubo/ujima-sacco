import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Users, Zap, CheckCircle, Star } from 'lucide-react'

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <div style={{ minHeight: '100dvh', background: '#faf8f5', fontFamily: "'Nunito', sans-serif" }}>

      {/* Top nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 68,
        background: '#fff', borderBottom: '1px solid #e8e0d5',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: '#1a4731', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🦁</div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: '1.25rem', fontWeight: 700, color: '#1a4731' }}>Ujima SACCO</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => nav('/officer/login')} style={{ padding: '9px 18px', borderRadius: 9, fontWeight: 700, fontSize: '0.88rem', border: '1.5px solid #e8e0d5', background: 'transparent', cursor: 'pointer', color: '#6b6560', transition: 'all .15s' }}
            onMouseOver={e => { e.currentTarget.style.background = '#f2ede6'; e.currentTarget.style.color = '#1c1917' }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b6560' }}>
            Officer Login
          </button>
          <button onClick={() => nav('/applicant/login')} style={{ padding: '9px 20px', borderRadius: 9, fontWeight: 700, fontSize: '0.88rem', border: 'none', background: '#1a4731', color: '#fff', cursor: 'pointer', transition: 'opacity .15s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            Apply for a Loan
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a4731 0%, #1f5c3d 60%, #2d6a4f 100%)',
        padding: '100px 48px 110px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        {[
          { top: -80, right: -80, size: 300, color: '#e9a01a', op: .07 },
          { bottom: -60, left: -60, size: 220, color: '#52b788', op: .1 },
          { top: 40, left: '30%', size: 150, color: '#fff', op: .03 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', width: b.size, height: b.size,
            borderRadius: '50%', background: b.color, opacity: b.op,
            top: b.top, bottom: b.bottom, left: b.left, right: b.right,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(233,160,26,.15)', border: '1px solid rgba(233,160,26,.3)',
            color: '#e9a01a', fontSize: '0.75rem', fontWeight: 800,
            letterSpacing: '.08em', textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: 100, marginBottom: 28,
          }}>
            <Zap size={12} fill="currentColor" /> AI-Powered Community Finance
          </div>

          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 700, color: '#fff',
            lineHeight: 1.1, letterSpacing: '-.02em',
            marginBottom: 20, maxWidth: 700, margin: '0 auto 20px',
          }}>
            Finance built for<br />
            <em style={{ color: '#e9a01a', fontStyle: 'italic' }}>every Kenyan</em>
          </h1>

          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 52px' }}>
            Ujima SACCO connects informal traders, farmers, and workers with fair,
            AI-evaluated loans — no bias, no jargon, no Silicon Valley assumptions.
          </p>

          {/* The two big CTAs */}
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <LoginCard
              emoji="🌿"
              title="I need a loan"
              desc="Apply in minutes. Watch our AI agents evaluate you live and transparently."
              btnLabel="Apply as a Member"
              btnColor="#e9a01a"
              btnText="#1c1917"
              onClick={() => nav('/applicant/login')}
              highlight
            />
            <LoginCard
              emoji="🏦"
              title="I'm a loan officer"
              desc="Access the dashboard to review applications, manage portfolio, and run agent triage."
              btnLabel="Officer Dashboard"
              btnColor="rgba(255,255,255,.12)"
              btnText="#fff"
              border="rgba(255,255,255,.2)"
              onClick={() => nav('/officer/login')}
            />
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid #e8e0d5' }}>
        {[
          { val: 'KES 4.2M', label: 'Disbursed this year' },
          { val: '94%',      label: 'Repayment rate' },
          { val: '< 3 min',  label: 'AI evaluation time' },
          { val: '68%',      label: 'Female borrowers' },
        ].map(s => (
          <div key={s.label} style={{ padding: '28px 32px', borderRight: '1px solid #e8e0d5', textAlign: 'center', background: '#fff' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: '1.8rem', fontWeight: 700, color: '#1a4731', marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: '0.8rem', color: '#a09b97', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How agents work */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 48px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a09b97', textTransform: 'uppercase', letterSpacing: '.1em', textAlign: 'center', marginBottom: 10 }}>Our AI Agent Pride</p>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: 48, color: '#1c1917' }}>
          Three agents. One fair decision.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {[
            { emoji: '📡', name: 'Scout', role: 'Financial Coach', color: '#d8f3dc', text: '#1a4731', desc: 'Reads your profile and gives personalised financial literacy advice based on your occupation and income season.' },
            { emoji: '🛡️', name: 'Guardian', role: 'Loan Reviewer', color: '#ddf0f8', text: '#1a6b8a', desc: 'Triages your application fairly — checking income, harvest cycles, and risk factors with dignity and no bias.' },
            { emoji: '🦁', name: 'Hunter', role: 'Officer Coordinator', color: '#fce9b8', text: '#b87d0e', desc: 'Prepares a full briefing for your human officer, matched by expertise — and never approves or denies alone.' },
          ].map(a => (
            <div key={a.name} style={{ background: '#fff', border: '1px solid #e8e0d5', borderRadius: 18, padding: '24px 22px' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{a.emoji}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: '1.05rem', fontWeight: 700, marginBottom: 2 }}>{a.name}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: a.text, background: a.color, display: 'inline-block', padding: '2px 10px', borderRadius: 100, marginBottom: 12 }}>{a.role}</div>
              <p style={{ fontSize: '0.85rem', color: '#6b6560', lineHeight: 1.65 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ background: '#f2ede6', padding: '64px 48px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.8rem', fontWeight: 700, textAlign: 'center', marginBottom: 40, color: '#1c1917' }}>
            What our members say
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {[
              { name: 'Grace A.', county: 'Kakamega', text: 'I watched the agents evaluate me live. For the first time I understood exactly why I qualified. No secrets, no confusion.' },
              { name: 'Joseph M.', county: 'Nakuru', text: 'As a maize farmer, they actually understood my harvest schedule. My repayments match my October income peak perfectly.' },
              { name: 'Fatuma S.', county: 'Mombasa', text: 'The Scout agent gave me budgeting tips I never knew. Even before my loan was approved I learned something valuable.' },
            ].map(t => (
              <div key={t.name} style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e8e0d5' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#e9a01a" color="#e9a01a" />)}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#3c3733', lineHeight: 1.65, marginBottom: 14, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a4731' }}>{t.name} <span style={{ color: '#a09b97', fontWeight: 400 }}>· {t.county}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ background: '#1a4731', padding: '64px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: 12 }}>Ready to get started?</h2>
        <p style={{ color: 'rgba(255,255,255,.55)', marginBottom: 32, fontSize: '1rem' }}>Join thousands of Kenyans building financial resilience with Ujima.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => nav('/applicant/login')} style={{ padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: '1rem', border: 'none', background: '#e9a01a', color: '#1c1917', cursor: 'pointer' }}>
            Apply for a Loan →
          </button>
          <button onClick={() => nav('/officer/login')} style={{ padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: '1rem', border: '1.5px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
            Officer Login
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#141210', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: '#e9a01a', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🦁</div>
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '0.82rem', fontWeight: 600 }}>Ujima SACCO</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '0.75rem' }}>Regulated by SASRA · Kenya DPA 2022 · AWS Africa (Cape Town)</p>
      </div>
    </div>
  )
}

function LoginCard({ emoji, title, desc, btnLabel, btnColor, btnText, border, onClick, highlight }) {
  return (
    <div style={{
      background: highlight ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.04)',
      border: `1.5px solid ${border || (highlight ? 'rgba(233,160,26,.4)' : 'rgba(255,255,255,.1)')}`,
      borderRadius: 20, padding: '32px 28px',
      width: 280, textAlign: 'center',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ fontSize: '2.4rem', marginBottom: 14 }}>{emoji}</div>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.6, marginBottom: 24 }}>{desc}</p>
      <button onClick={onClick} style={{
        width: '100%', padding: '13px', borderRadius: 11,
        fontWeight: 800, fontSize: '0.92rem',
        border: border ? `1.5px solid ${border}` : 'none',
        background: btnColor, color: btnText,
        cursor: 'pointer', transition: 'opacity .15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      }}
        onMouseOver={e => e.currentTarget.style.opacity = '.88'}
        onMouseOut={e => e.currentTarget.style.opacity = '1'}
      >
        {btnLabel} <ArrowRight size={15} />
      </button>
    </div>
  )
}
