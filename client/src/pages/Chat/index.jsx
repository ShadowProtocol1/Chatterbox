import { useEffect } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/store"
import ContactsConatiner from "../Chat/components/contacts-container"
import EmptyChatConatiner from "./components/empty-container"
import ChatContainer from "./components/chat-container"
import { LoadingScreen } from "@/components/loading-screen"
import { useTheme } from "@/context/ThemeContext"

const Chat = () => {

    const { userInfo, selectedChatType, isUploading, isDownloading, fileUploadProgress, fileDownloadProgress } = useAppStore()
    const { isDark } = useTheme()
    const navigate = useNavigate()

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("Please setup profile to continue")
            navigate("/profile")
        }
    }, [userInfo, navigate])

    return (<div className="flex h-[100vh] text-foreground bg-background overflow-hidden ">
        {
            isUploading && (
                <LoadingScreen
                    message={`Uploading File (${fileUploadProgress}%)`}
                    overlay={true}
                    loaderType="pulse"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg"
                />
            )
        }
        {
            isDownloading && (
                <LoadingScreen
                    message={`Downloading File (${fileDownloadProgress}%)`}
                    overlay={true}
                    loaderType="pulse"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg"
                />
            )
        }
        <ContactsConatiner />
        {selectedChatType === undefined ? (
            <EmptyChatConatiner />
        ) : (
            <ChatContainer />
        )
        }
    </div>
    )
}

export default Chat 