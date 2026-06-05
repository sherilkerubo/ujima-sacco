import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/ui/Sidebar'
import Toast from './components/ui/Toast'
import Dashboard from './pages/Dashboard'
import ApplicationsPage from './pages/ApplicationsPage'
import ApplyPage from './pages/ApplyPage'
import LoanDetailPage from './pages/LoanDetailPage'
import AgentsPage from './pages/AgentsPage'
import MembersPage from './pages/MembersPage'
import ReportsPage from './pages/ReportsPage'
import CustomerPortal from './portal/CustomerPortal'

function OfficerShell() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="main-area">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/:id" element={<LoanDetailPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<div className="page-wrap"><h1 className="page-title">Settings</h1><p className="page-subtitle" style={{marginTop:8}}>Coming soon.</p></div>} />
        </Routes>
      </div>
      <Toast />
    </div>
  )
}

function AppRouter() {
  return (
    <Routes>
      {/* Customer portal — no sidebar */}
      <Route path="/portal/*" element={<CustomerPortal />} />
      {/* Officer dashboard */}
      <Route path="/*" element={<OfficerShell />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProvider>
  )
}
