import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)

const INITIAL_LOANS = [
  { id:'L-2401', name:'Grace Achieng', initials:'GA', occ:'Market vendor', county:'Kakamega', amount:28000, purpose:'School fees', status:'approved', score:82, date:'2025-01-08', children:3, harvest:true, income:'mid', agentRun:true },
  { id:'L-2402', name:'Joseph Mwangi', initials:'JM', occ:'Maize farmer', county:'Nakuru', amount:15000, purpose:'Farm inputs', status:'approved', score:91, date:'2025-01-10', children:0, harvest:true, income:'mid', agentRun:true },
  { id:'L-2403', name:'Amina Hassan', initials:'AH', occ:'Shea butter trader', county:'Busia', amount:42000, purpose:'Business stock', status:'review', score:68, date:'2025-01-11', children:4, harvest:false, income:'low', agentRun:true },
  { id:'L-2404', name:'Peter Otieno', initials:'PO', occ:'Boda boda rider', county:'Kisumu', amount:8500, purpose:'Equipment purchase', status:'approved', score:79, date:'2025-01-12', children:1, harvest:false, income:'mid', agentRun:false },
  { id:'L-2405', name:'Fatuma Said', initials:'FS', occ:'Small tailor', county:'Mombasa', amount:12000, purpose:'Business stock', status:'pending', score:null, date:'2025-01-14', children:2, harvest:false, income:'low', agentRun:false },
  { id:'L-2406', name:'Daniel Kimani', initials:'DK', occ:'Formal employee', county:'Nairobi', amount:75000, purpose:'Medical emergency', status:'review', score:55, date:'2025-01-14', children:0, harvest:false, income:'high', agentRun:true },
]

export const OFFICER_ACCOUNTS = [
  { id:'off_001', name:'Sarah Wambui',   email:'sarah@ujima.co.ke',  password:'officer123', role:'officer', initials:'SW', title:'Senior Loan Officer' },
  { id:'off_002', name:'James Otieno',   email:'james@ujima.co.ke',  password:'officer123', role:'officer', initials:'JO', title:'Loan Officer' },
]

export const APPLICANT_ACCOUNTS = [
  { id:'app_001', name:'Grace Achieng',  email:'grace@email.com',    password:'member123',  role:'applicant', initials:'GA', phone:'+254712345678' },
  { id:'app_002', name:'Peter Otieno',   email:'peter@email.com',    password:'member123',  role:'applicant', initials:'PO', phone:'+254723456789' },
]

export function AppProvider({ children }) {
  const [loans, setLoans] = useState(INITIAL_LOANS)
  const [toast, setToast] = useState(null)
  const [authUser, setAuthUser] = useState(null)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }, [])

  const login = useCallback((user) => {
    setAuthUser(user)
  }, [])

  const logout = useCallback(() => {
    setAuthUser(null)
  }, [])

  const addLoan = useCallback((loan) => {
    const id = `L-${2406 + loans.length + 1}`
    const newLoan = { ...loan, id, date: new Date().toISOString().split('T')[0], status: 'pending' }
    setLoans(prev => [newLoan, ...prev])
    return newLoan
  }, [loans.length])

  const updateLoan = useCallback((id, updates) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
  }, [])

  const myLoans = authUser?.role === 'applicant'
    ? loans.filter(l => l.applicantId === authUser.id || l.name === authUser.name)
    : loans

  return (
    <Ctx.Provider value={{
      loans, myLoans, addLoan, updateLoan,
      toast, showToast,
      authUser, login, logout,
      currentUser: authUser,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)
