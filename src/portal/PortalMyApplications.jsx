import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { FileText, ArrowRight, Check, Clock, AlertTriangle, X } from 'lucide-react'

const fmt = n => `KES ${Number(n).toLocaleString()}`

const TRACK_STEPS = ['Submitted', 'AI Review', 'Officer Check', 'Decision']
const STATUS_STEP = { pending: 1, review: 2, approved: 3, rejected: 3 }

const STATUS_CFG = {
  approved: { cls: 'approved', label: 'Approved ✓' },
  pending:  { cls: 'pending',  label: 'Pending' },
  review:   { cls: 'review',   label: 'Under Review' },
  rejected: { cls: 'rejected', label: 'Not Approved' },
}

function trackState(stepIdx, status) {
  const currentStep = STATUS_STEP[status] ?? 1
  if (stepIdx < currentStep) return 'done'
  if (stepIdx === currentStep) return 'active'
  return ''
}

export default function PortalMyApplications() {
  const { loans } = useApp()
  const nav = useNavigate()

  // Filter to customer-submitted only — for demo show all
  const myLoans = loans

  if (myLoans.length === 0) {
    return (
      <div className="portal-content">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--p-ff-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 6 }}>My Applications</h1>
          <p style={{ color: 'var(--p-ink-soft)', fontSize: '0.9rem' }}>Track the status of your loan applications</p>
        </div>
        <div className="portal-empty">
          <div className="portal-empty-icon">📋</div>
          <div className="portal-empty-title">No applications yet</div>
          <div className="portal-empty-desc">You haven't submitted any loan applications. Apply now and our agents will evaluate you in minutes.</div>
          <button className="portal-btn primary" style={{ marginTop: 20 }} onClick={() => nav('/portal/apply')}>
            Apply Now <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="portal-content">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--p-ff-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 6 }}>My Applications</h1>
          <p style={{ color: 'var(--p-ink-soft)', fontSize: '0.9rem' }}>{myLoans.length} application{myLoans.length !== 1 ? 's' : ''} on record</p>
        </div>
        <button className="portal-btn primary" onClick={() => nav('/portal/apply')}>
          + New Application
        </button>
      </div>

      {myLoans.map(loan => {
        const s = STATUS_CFG[loan.status] || STATUS_CFG.pending
        const currentStep = STATUS_STEP[loan.status] ?? 1

        return (
          <div key={loan.id} className="portal-status-card">
            {/* Header */}
            <div className="portal-status-header">
              <div>
                <div className="portal-status-id">{loan.id} · Applied {loan.date}</div>
                <div className="portal-status-name">{loan.purpose}</div>
              </div>
              <span className={`portal-badge ${s.cls}`}>{s.label}</span>
            </div>

            {/* Progress track */}
            <div className="portal-status-track" style={{ marginBottom: 20 }}>
              {TRACK_STEPS.map((label, i) => {
                const state = trackState(i, loan.status)
                return (
                  <div key={label} className={`portal-track-step ${state}`} style={{ flex: i < TRACK_STEPS.length - 1 ? 1 : 'none' }}>
                    <div className="portal-track-dot">
                      {state === 'done'
                        ? <Check size={13} />
                        : state === 'active'
                        ? <Clock size={13} />
                        : i + 1
                      }
                    </div>
                    <span className="portal-track-label">{label}</span>
                  </div>
                )
              })}
            </div>

            {/* Loan meta */}
            <div className="portal-status-meta">
              <div className="portal-meta-item">
                <span className="portal-meta-label">Amount</span>
                <span className="portal-meta-value">{fmt(loan.amount)}</span>
              </div>
              <div className="portal-meta-item">
                <span className="portal-meta-label">Occupation</span>
                <span className="portal-meta-value" style={{ fontSize: '0.88rem' }}>{loan.occ}</span>
              </div>
              <div className="portal-meta-item">
                <span className="portal-meta-label">AI Score</span>
                <span className="portal-meta-value" style={{ color: loan.score >= 80 ? 'var(--p-forest-mid)' : loan.score >= 60 ? 'var(--p-gold-deep)' : loan.score ? 'var(--p-danger)' : 'var(--p-ink-mute)', fontSize: loan.score ? undefined : '0.85rem' }}>
                  {loan.score ? `${loan.score}/100` : '—'}
                </span>
              </div>
            </div>

            {/* Status message */}
            {loan.status === 'pending' && (
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--p-gold-pale)', borderRadius: 10, fontSize: '0.83rem', color: 'var(--p-gold-deep)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <Clock size={14} /> Our agents are reviewing your application. You'll hear back shortly.
              </div>
            )}
            {loan.status === 'review' && (
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--p-earth-pale)', borderRadius: 10, fontSize: '0.83rem', color: 'var(--p-earth)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <AlertTriangle size={14} /> A human officer is reviewing your application. Expected response within 15 minutes during business hours.
              </div>
            )}
            {loan.status === 'approved' && (
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--p-forest-pale)', borderRadius: 10, fontSize: '0.83rem', color: 'var(--p-forest)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <Check size={14} /> <strong>Your loan has been approved!</strong> A loan officer will contact you on your registered number to arrange disbursement.
              </div>
            )}
            {loan.status === 'rejected' && (
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--p-danger-pale)', borderRadius: 10, fontSize: '0.83rem', color: 'var(--p-danger)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <X size={14} /> We were unable to approve this application. You may reapply after 30 days or call us at <strong>0800 724 000</strong> to discuss.
              </div>
            )}
          </div>
        )
      })}

      <div style={{ marginTop: 24, padding: '20px', background: 'var(--p-paper-warm)', borderRadius: 14, textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--p-ink-soft)', marginBottom: 8 }}>Have a question about your application?</p>
        <p style={{ fontWeight: 700, color: 'var(--p-forest)', fontSize: '0.9rem' }}>📞 Call us: 0800 724 000 · Mon–Fri 8am–6pm</p>
      </div>
    </div>
  )
}
