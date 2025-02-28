import VictorySymbol from "@/components/VictorySymbol";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Victory from "@/assets/victory.svg";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
    const navigate = useNavigate()
    const { setUserInfo } = useAppStore
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()


    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is required")
            return false
        }
        if (!password.length) {
            toast.error("Password is required")
            return false
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return false
        }
        return true
    }
    const handleLogin = async () => {
        if (validateSignup()) {
            const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true })
            if (response.data.user.id) {
                if (response.data.user.profileSetup) {
                    setUserInfo(response.data.user)
                    navigate("/chat")
                } else {
                    navigate("/profile")
                }
            }
        }
    }

    const handleSignUp = async () => {
        if (validateSignup()) {
            const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true })
            if (response.status === 201) {
                setUserInfo(response.data.user)
                toast.success("Account created successfully")
                navigate("/profile")
            }
        }
    }
    return (
        <div className=" h-[100vh] w-[90vw] flex item-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items—center justify—center">
                            <h1 className="text-5xl font-bold md:text-6xl flex p-2">Welcome </h1>
                            <img src={VictorySymbol} alt="" />
                        </div>
                        <p className="font-medium  text-center">Fill in the details to get started with the best chat app!</p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300" value="login">Login</TabsTrigger>
                                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300" value="signup">Sign Up</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 mt-4" value="login">
                                <input placeholder="Email" type="email" className="rounded-full p-3" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                <input placeholder="Password" type="password" className="rounded-full p-3" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                                <Button className="rounded-full p-3" onClick={handleLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-5 mt-4" value="signup">
                                <input placeholder="Email" type="email" className="rounded-full p-3" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                <input placeholder="Password" type="password" className="rounded-full p-3" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                                <input placeholder="Confirm Password" type="password" className="rounded-full p-3" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                                <Button className="rounded-full p-3" onClick={handleSignUp}>Sign Up</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:lex justify-center items-center">
                    <img src={Victory} alt="background login" className="h-[700px]" />
                </div>
            </div>
        </div>
    )
}
export default Auth;