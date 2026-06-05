import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, PlusCircle, Users, Bot, BarChart2, Settings } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Applications', icon: FileText, path: '/applications', badge: 2 },
  { label: 'New Loan', icon: PlusCircle, path: '/apply' },
  { label: 'Members', icon: Users, path: '/members' },
  { label: 'Agent Pride', icon: Bot, path: '/agents' },
  { label: 'Reports', icon: BarChart2, path: '/reports' },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const { currentUser } = useApp()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <div className="logo-icon">🦁</div>
          <span className="logo-name">Ujima</span>
        </div>
        <div className="logo-sub">SACCO · Est. 2019</div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Main</span>
        {NAV.map(({ label, icon: Icon, path, badge }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item${pathname === path ? ' active' : ''}`}
          >
            <Icon size={17} />
            <span>{label}</span>
            {badge && <span className="nav-badge">{badge}</span>}
          </Link>
        ))}
        <span className="nav-section-label">Account</span>
        <Link to="/settings" className="nav-item">
          <Settings size={17} />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{currentUser.initials}</div>
          <div>
            <div className="avatar-name">{currentUser.name}</div>
            <div className="avatar-role">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
