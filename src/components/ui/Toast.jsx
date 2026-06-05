import { useApp } from '../../context/AppContext'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const isError = toast.type === 'error'
  return (
    <div className="toast" style={{ background: isError ? 'var(--danger)' : 'var(--ink)' }}>
      {isError ? <AlertCircle size={16}/> : <CheckCircle size={16} color="var(--forest-light)"/>}
      {toast.msg}
    </div>
  )
}
