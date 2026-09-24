import { useEffect } from 'react'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import GoogleLoginPage from '../pages/GoogleLoginPage'

function LoginRoute() {
  const isLoggedIn = Boolean(localStorage.getItem('access_token'))

  useEffect(() => {
    if (isLoggedIn) window.location.replace('/')
  }, [isLoggedIn])

  return isLoggedIn ? <HomePage /> : <LoginPage />
}

function AppRouter() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/login/google') return <GoogleLoginPage />
  if (path === '/login') return <LoginRoute />
  return <HomePage />
}

export default AppRouter
