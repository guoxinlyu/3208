import { Navigate, useLocation } from 'react-router-dom'
import { isAuthed } from '../lib/auth.js'

export default function ProtectedRoute({ children }) {
    const authed = isAuthed()
    const location = useLocation()
    if (!authed) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }
    return children
}
