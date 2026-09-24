import { useState } from 'react'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/login/google`

function LoginPage() {
  const [error, setError] = useState('')

  function loginWithGoogle() {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID in your environment.')
      return
    }
    const stateBytes = crypto.getRandomValues(new Uint8Array(32))
    const state = Array.from(stateBytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
    sessionStorage.setItem('google_oauth_state', state)

    const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authorizationUrl.search = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile email',
      state,
      prompt: 'select_account',
    }).toString()
    window.location.assign(authorizationUrl)
  }

  return <main className="auth-page"><section className="auth-card">
    <a className="wordmark" href="/">llm<span>hub</span></a>
    <p className="auth-eyebrow">YOUR MODEL WORKSPACE</p>
    <h1>Welcome back.</h1>
    <p className="auth-description">Sign in securely with your Google account to continue to LLMHub.</p>
    <button className="google-button" type="button" onClick={loginWithGoogle}>
      <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4 2-6.8 2-5.2 0-9.6-3.5-11.2-8.2H5.9v5.3A20 20 0 0 0 24 44Z"/><path fill="#4A90E2" d="M12.8 27.8a12 12 0 0 1 0-7.6v-5.3H5.9a20 20 0 0 0 0 18.2l6.9-5.3Z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.9 14.9l6.9 5.3C14.4 15.5 18.8 12 24 12Z"/></svg>
      Continue with Google
    </button>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <p className="auth-note">No password needed. We’ll use your verified Google account.</p>
    <a className="auth-home" href="/">← Back to LLMHub</a>
  </section></main>
}

export default LoginPage
