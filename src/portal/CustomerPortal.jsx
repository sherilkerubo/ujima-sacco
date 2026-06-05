import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import PortalLanding from './PortalLanding'
import PortalApply from './PortalApply'
import PortalMyApplications from './PortalMyApplications'
import './portal.css'

export default function CustomerPortal() {
  const loc = useLocation()
  const nav = useNavigate()

  const isApply = loc.pathname === '/portal/apply'
  const isMyApps = loc.pathname === '/portal/my-applications'

  return (
    <div className="portal-root">
      {/* Portal Nav */}
      <nav className="portal-nav">
        <button className="portal-logo" onClick={() => nav('/portal')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <div className="portal-logo-icon">🦁</div>
          <span className="portal-logo-name">Ujima SACCO</span>
        </button>
        <div className="portal-nav-links">
          <button className={`portal-nav-link ${!isApply && !isMyApps ? 'active' : ''}`} onClick={() => nav('/portal')}>
            Home
          </button>
          <button className={`portal-nav-link ${isMyApps ? 'active' : ''}`} onClick={() => nav('/portal/my-applications')}>
            My Applications
          </button>
          <button className="portal-nav-cta" onClick={() => nav('/portal/apply')}>
            Apply Now
          </button>
        </div>
      </nav>

      {/* Portal routes */}
      <Routes>
        <Route path="/" element={<PortalLanding />} />
        <Route path="/apply" element={<PortalApply />} />
        <Route path="/my-applications" element={<PortalMyApplications />} />
      </Routes>

      {/* Portal footer */}
      <footer style={{ background: 'var(--p-forest)', padding: '32px', marginTop: 'auto' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, background: 'var(--p-gold)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🦁</div>
            <span style={{ fontFamily: 'var(--p-ff-display)', color: 'var(--p-white)', fontWeight: 700 }}>Ujima SACCO</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '0.8rem' }}>
            Regulated by SASRA · Data stored under Kenya DPA 2022 · AWS Africa (Cape Town)
          </p>
          <button
            style={{ background: 'none', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.55)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}
            onClick={() => nav('/')}
          >
            Officer Dashboard →
          </button>
        </div>
      </footer>
    </div>
  )
}
