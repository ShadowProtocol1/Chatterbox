import { useState } from 'react'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants'
import background from '@/assets/background-login.png'
import Victory from '@/assets/victory.svg' // Uncomment if you have a victory image to use
import { useNavigate } from 'react-router-dom'
import { useAppStore } from "@/store"
import { LoadingScreen } from '@/components/loading-screen'

const Auth = () => {
    const navigate = useNavigate()
    const { setUserInfo, isAuthLoading, setIsAuthLoading } = useAppStore()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState("")

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required")
            return false
        }

        if (!password.length) {
            toast.error("Password is required")
            return false
        }

        return true
    }

    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is required")
            return false
        }

        if (!password.length) {
            toast.error("Password is required")
            return false
        } if (password !== confirmPassword) {
            toast.error("Password and confirm password should be same")
            return false
        }
        return true
    }

    const handleLogin = async () => {
        if (validateLogin()) {
            setIsAuthLoading(true)
            try {
                const response = await apiClient.post(LOGIN_ROUTE, {
                    email,
                    password
                }, { withCredentials: true })

                if (response.data.user.id) {
                    setUserInfo(response.data.user)
                    if (response.data.user.profileSetup) navigate('/chat')
                    else navigate('/profile')
                }
            } catch (error) {
                console.error('Login error:', error)
                toast.error(error.response?.data || 'Login failed')
            } finally {
                setIsAuthLoading(false)
            }
        }
    }

    const handleSignup = async () => {
        if (validateSignup()) {
            setIsAuthLoading(true)
            try {
                const response = await apiClient.post(SIGNUP_ROUTE, {
                    email,
                    password
                }, { withCredentials: true })
                if (response.status === 201) {
                    setUserInfo(response.data.user)
                    navigate("/profile")
                }
            } catch (error) {
                console.error('Signup error:', error)
                toast.error(error.response?.data || 'Signup failed')
            } finally {
                setIsAuthLoading(false)
            }
        }
    }

    if (isAuthLoading) {
        return <LoadingScreen message="Authenticating..." />
    }    return (
        <div className='h-[100vh] w-[100vw] flex items-center justify-center bg-background'>
            <div className='h-[90vh] bg-card border-2 border-border text-card-foreground shadow-2xl w-[80vw] rounded-3xl grid md:w-[90vw] lg:w-[70vw] xl:w-[60vw] xl:grid-cols-2'>
                <div className='flex flex-col gap-10 items-center justify-center lg:pl-10'>
                    <div className='flex items-center justify-center flex-col'>
                        <div className='flex items-center justify-center'>
                            <h1 className='text-5xl font-bold md:text-6xl pl-10 text-foreground'>Welcome</h1>
                            <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
                        </div>
                        <p className="font-medium text-center text-muted-foreground">Fill in the details to get started with the best chat app!</p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-foreground text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-4 transition-all duration-300">Login</TabsTrigger>
                                <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-foreground text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-4 transition-all duration-300">Signup</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 mt-2" value="login">
                                <Input placeholder="Email" type="email" className="rounded-full p-2 pl-4 bg-input border-input" value={email} onChange={e => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="password" className="rounded-full p-2 pl-4 bg-input border-input" value={password} onChange={e => setPassword(e.target.value)} />
                                <Button className="rounded-full p-2" onClick={handleLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-5 mt-2" value="signup">
                                <Input placeholder="Email" type="email" className="rounded-full p-2 pl-4 bg-input border-input" value={email} onChange={e => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="password" className="rounded-full p-2 pl-4 bg-input border-input" value={password} onChange={e => setPassword(e.target.value)} />
                                <Input placeholder="Confirm Password" type="password" className="rounded-full p-2 pl-4 bg-input border-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                <Button className="rounded-full p-2" onClick={handleSignup}>Signup</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className='hidden xl:flex justify-end items-center'>
                    <img src={background} alt="background login" className='h-[400px]' />
                </div>
            </div>
        </div>
    )
}

export default Auth