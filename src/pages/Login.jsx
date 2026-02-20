import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../App'

const API_URL = import.meta.env.VITE_API_URL || 'https://3000-ira245erppsrdirm200d8-23969b88.us1.manus.computer';

export default function Login() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleMagicLink = async (e) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send magic link')
      }

      setMagicLinkSent(true)
    } catch (err) {
      console.error('Magic link error:', err)
      setError(err.message || 'Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider)
    setError('')
    
    try {
      // In production, this would redirect to OAuth provider.
      // For now, we create a real session via the social login API.
      const mockEmail = provider === 'google' ? 'admin@techypark.com' : 'admin-apple@techypark.com'
      const mockName = provider === 'google' ? 'Admin User' : 'Admin User'
      
      const response = await fetch(`${API_URL}/api/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: mockEmail,
          name: mockName
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store session token
      localStorage.setItem('techypark_session', data.sessionToken)
      
      // Login with user data
      login(data.user)
      navigate('/')
    } catch (err) {
      console.error('Social login error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoadingProvider(null)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              We've sent a magic link to
            </p>
            <p className="font-medium text-slate-900 dark:text-white mb-4">{email}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Click the link in the email to sign in to your account. The link will expire in 10 minutes.
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong>Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
              </p>
            </div>
            
            <button
              onClick={() => {
                setMagicLinkSent(false)
                setEmail('')
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="TechyPark" className="w-10 h-10" />
          </div>
          <span className="text-xl font-bold text-white">TechyPark Engine</span>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Unified Cloud Control Platform
          </h1>
          <p className="text-xl text-white/80">
            Manage servers, sites, DNS, email, containers, and more from a single dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
            <span>CyberPanel-class hosting management</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
            <span>AI-augmented monitoring & automation</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
            <span>Built-in CRM, billing & analytics</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img src="/logo.png" alt="TechyPark" className="w-10 h-10" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">TechyPark Engine</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your account to continue</p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              {/* Google Login */}
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl font-medium text-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingProvider === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              {/* Apple Login */}
              <button
                onClick={() => handleSocialLogin('apple')}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-black hover:bg-gray-900 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingProvider === 'apple' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                )}
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-slate-500">or continue with email</span>
              </div>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLink}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending magic link...</span>
                  </>
                ) : (
                  <>
                    <span>Send magic link</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* No password notice */}
            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              No password required. We'll send you a secure link to sign in.
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
          </p>

          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact sales
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
