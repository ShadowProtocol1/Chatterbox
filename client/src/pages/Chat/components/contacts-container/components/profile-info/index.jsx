import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppStore } from "@/store"
import { HOST, LOGOUT_ROUTE } from "@/utils/constants"
import { Tooltip } from "@radix-ui/react-tooltip"
import { FiEdit2 } from "react-icons/fi"
import { IoPowerSharp } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { apiClient } from "@/lib/api-client"
import { getColor } from "@/lib/utils"
import { useSocket } from "@/context/SocketContext"
import ThemeToggle from "@/components/theme-toggle"
import { useTheme } from "@/context/ThemeContext"

const ProfileInfo = () => {

    const { userInfo, logOut: clearUserState, clearChatData } = useAppStore()
    const { isDark } = useTheme()
    const navigate = useNavigate()
    const socket = useSocket()

    const logOut = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true })
            if (response.status === 200) {
                // Disconnect socket if it exists
                if (socket) {
                    socket.disconnect()
                }
                // Clear all state and navigate to auth
                clearUserState()
                clearChatData()
                navigate('/auth')
            }
        } catch (error) {
            console.error("Logout error:", error)
            // Even if the server request fails, clear local state
            if (socket) {
                socket.disconnect()
            }
            clearUserState()
            clearChatData()
            navigate('/auth')
        }
    }

    return <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-muted border-t border-border">        <div className="flex gap-3 items-center justify-center">
        <div className="w-10 h-10 relative">
            <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {userInfo.image ? (
                    <AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile" className="object-cover w-full h-full bg-muted" />
                ) : (
                    <div className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                        {userInfo.firstName
                            ? userInfo.firstName.split("").shift()
                            : userInfo.email.split("").shift()}
                    </div>
                )
                }
            </Avatar>            </div>
        <div className="text-foreground">
            {userInfo.firstName && userInfo.lastName
                ? `${userInfo.firstName} ${userInfo.lastName}`
                : ""}
        </div>        </div>
        <div className="flex gap-2 items-center ml-6"><TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <ThemeToggle size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover border-border text-popover-foreground">
                    <p>Switch to {isDark ? 'light' : 'dark'} mode</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FiEdit2 className="text-purple-500 text-xl font-medium hover:text-purple-400 transition-colors cursor-pointer" onClick={() => navigate('/profile')} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover border-border text-popover-foreground">Edit Profile</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <IoPowerSharp className="text-red-500 text-xl font-medium hover:text-red-400 transition-colors cursor-pointer" onClick={logOut} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover border-border text-popover-foreground">Logout</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    </div>
}

export default ProfileInfo