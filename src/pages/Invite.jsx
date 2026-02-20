import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../App'
import { Mail, User, Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const API_URL = 'https://3000-ira245erppsrdirm200d8-23969b88.us1.manus.computer'

export default function Invite() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const token = searchParams.get('token')
  
  const [loading, setLoading] = useState(true)
  const [invitation, setInvitation] = useState(null)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    const verifyInvitation = async () => {
      if (!token) {
        setError('No invitation token provided')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/invitations/verify/${token}`)
        const data = await response.json()

        if (response.ok && data.valid) {
          setInvitation(data.invitation)
          setName(data.invitation.email.split('@')[0])
        } else {
          setError(data.error || 'Invalid or expired invitation')
        }
      } catch (err) {
        setError('Failed to verify invitation. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    verifyInvitation()
  }, [token])

  const handleAccept = async (e) => {
    e.preventDefault()
    setAccepting(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/invitations/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAccepted(true)
        login(data.user)
        localStorage.setItem('techypark_session', data.sessionToken)
        setTimeout(() => navigate('/'), 2000)
      } else {
        setError(data.error || 'Failed to accept invitation')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Verifying invitation...</p>
        </div>
      </div>
    )
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Invalid Invitation</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <button onClick={() => navigate('/login')} className="btn-primary w-full">Go to Login</button>
          </div>
        </div>
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to TechyPark Engine!</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Your account has been created successfully. Redirecting to dashboard...</p>
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <img src="/logo.png" alt="TechyPark" className="w-10 h-10" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">TechyPark Engine</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Cloud Control Platform</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">You're Invited!</h1>
            <p className="text-green-100 text-sm mt-1">
              {invitation.inviterName || invitation.inviterEmail} invited you to join
            </p>
          </div>

          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                  <p className="font-medium text-slate-900 dark:text-white">{invitation.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <Shield className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Role</p>
                  <p className="font-medium text-slate-900 dark:text-white">{invitation.role}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleAccept} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="input pl-10"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">This is how you'll appear to other team members</p>
            </div>

            <button
              type="submit"
              disabled={accepting || !name.trim()}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {accepting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating your account...</>
              ) : (
                <><CheckCircle className="w-5 h-5" /> Accept Invitation</>
              )}
            </button>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              By accepting, you agree to our <a href="#" className="text-primary-500 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-primary-500 hover:underline font-medium">Sign in</button>
        </p>
      </div>
    </div>
  )
}
