import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../App'

const API_URL = import.meta.env.VITE_API_URL || 'https://3000-ira245erppsrdirm200d8-23969b88.us1.manus.computer';

export default function Verify() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setErrorMessage('No verification token provided')
      return
    }

    verifyToken(token)
  }, [searchParams])

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'Verification failed')
        return
      }

      // Store session token
      if (data.sessionToken) {
        localStorage.setItem('techypark_session', data.sessionToken)
      }

      // Login the user
      login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: null,
        role: data.user.role,
        provider: data.user.provider
      })

      setStatus('success')

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
      setErrorMessage('Unable to verify. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-700">
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Verifying your link
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Please wait while we verify your magic link...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Successfully verified!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                You're now signed in. Redirecting to dashboard...
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div className="bg-green-500 h-1.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Verification failed
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {errorMessage}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
              >
                Back to login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
