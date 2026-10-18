import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import api from '../utils/api'

function VerifyOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const email = location.state?.email || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await api.post('/auth/verify-otp', { otp, newPassword })
      setSuccess(res.data.message)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/resend-otp')
      setSuccess('OTP resent successfully')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Invalid session</p>
          <Link to="/forgot-password" className="mt-4 inline-block text-blue-600">Go back</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 relative">
      <Link
        to="/forgot-password"
        className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full p-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:left-6 sm:top-6"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </Link>
      <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Verify OTP
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter 4-digit OTP sent to {email}
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
            {success}
          </div>
        )}

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="otp"
              className="text-sm font-medium text-gray-900 dark:text-white"
            >
              OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                setError('')
              }}
              placeholder="1234"
              maxLength={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition-colors duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-900 dark:text-white"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setError('')
              }}
              placeholder="Enter new password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition-colors duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:text-white dark:hover:bg-purple-600"
          >
            {loading ? 'Verifying...' : 'Verify & Reset'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="mt-4 w-full text-center text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Resend OTP
        </button>
      </div>
    </div>
  )
}

export default VerifyOtp
