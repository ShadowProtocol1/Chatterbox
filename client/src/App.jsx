import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import LoaderDemo from './components/loader-demo'
import { useAppStore } from '@/store'
import { useState } from 'react'
import {apiClient} from '@/lib/api-client'
import { GET_USER_INFO } from '@/utils/constants'
import { LoadingScreen } from './components/loading-screen'
import { ThemeProvider } from '@/context/ThemeContext'

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  const isAuthenticated = !!userInfo
  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  const isAuthenticated = !!userInfo
  return isAuthenticated ? <Navigate to="/chat" /> : children
}
const App = () => {
  const [count, setCount] = useState(0)
  const { userInfo, setUserInfo } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        })

        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data)
        } else {
          setUserInfo(undefined)
        }
      } catch (error) {
        setUserInfo(undefined)
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!userInfo) {
      getUserData()
    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo])


  return (
    <ThemeProvider>
      {loading ? (
        <LoadingScreen message="Initializing your chat experience..." />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/loader-demo" element={<LoaderDemo />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  )
}

export default App
