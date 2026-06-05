import { useNavigate } from 'react-router-dom'
import { Zap, Shield, Clock, ArrowRight, CheckCircle } from 'lucide-react'

export default function PortalLanding() {
  const nav = useNavigate()

  return (
    <div>
      {/* Hero */}
      <div className="portal-hero">
        <div className="portal-hero-badge">
          <Zap size={12} fill="currentColor" />
          AI-powered loan decisions
        </div>
        <h1>
          Get the funds your<br/>
          <em>community deserves</em>
        </h1>
        <p>
          Apply for a loan in minutes. Our AI agents — Scout, Guardian, and Hunter —
          evaluate your application fairly and transparently, with no hidden bias.
        </p>
        <div className="portal-hero-actions">
          <button className="portal-hero-btn primary" onClick={() => nav('/portal/apply')}>
            Apply Now <ArrowRight size={18} />
          </button>
          <button className="portal-hero-btn ghost" onClick={() => nav('/portal/my-applications')}>
            Track My Application
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="portal-features">
        {[
          {
            icon: '🤖', bg: '#d8f3dc', title: '3 AI Agents Review You',
            desc: 'Scout assesses your financial profile, Guardian triages your loan, Hunter briefs a human officer — all within minutes.'
          },
          {
            icon: '⚖️', bg: '#fce9b8', title: 'Dignity-First Evaluation',
            desc: 'Our GUARD system blocks biased language and ensures every decision comes with a clear, respectful explanation.'
          },
          {
            icon: '🌾', bg: '#f8ede3', title: 'Harvest-Cycle Aware',
            desc: 'We understand maize seasons, matooke cycles, and informal income patterns — no Silicon Valley assumptions here.'
          },
        ].map(f => (
          <div key={f.title} className="portal-feature">
            <div className="portal-feature-icon" style={{ background: f.bg }}>{f.icon}</div>
            <div>
              <div className="portal-feature-title">{f.title}</div>
              <div className="portal-feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 32px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--p-ink-mute)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10, textAlign: 'center' }}>
          How it works
        </p>
        <h2 style={{ fontFamily: 'var(--p-ff-display)', fontSize: '1.8rem', fontWeight: 700, textAlign: 'center', marginBottom: 40, letterSpacing: '-.01em' }}>
          From application to decision in 3 steps
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {[
            { step: '01', icon: '📝', title: 'Fill your details', desc: 'Tell us about yourself — your occupation, income, and what you need the loan for. Takes about 3 minutes.' },
            { step: '02', icon: '🦁', title: 'Agents evaluate you', desc: 'Watch Scout, Guardian, and Hunter analyse your application live. No black box — you see every step.' },
            { step: '03', icon: '✅', title: 'Get a decision', desc: 'Receive a transparent outcome with clear reasoning. If escalated, a human officer reviews within 15 minutes.' },
          ].map(s => (
            <div key={s.step} style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--p-forest-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--p-ff-mono)', fontSize: '0.7rem', color: 'var(--p-ink-mute)', marginBottom: 6 }}>Step {s.step}</div>
              <div style={{ fontFamily: 'var(--p-ff-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: '0.83rem', color: 'var(--p-ink-soft)', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: '24px 28px', background: 'var(--p-forest)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: 'var(--p-ff-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--p-white)', marginBottom: 4 }}>Ready to apply?</p>
            <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,.55)' }}>Loans from KES 5,000 to KES 50,000. No hidden fees.</p>
          </div>
          <button className="portal-hero-btn primary" onClick={() => nav('/portal/apply')}>
            Start Application <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
