import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) return <Navigate to="/login" replace />

  // Clan ne sme da pristupi admin stranicama
  if (role === 'CLAN' && window.location.pathname !== '/moj-profil') {
    return <Navigate to="/moj-profil" replace />
  }

  return <>{children}</>
}