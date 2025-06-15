import { useEffect, useRef, useState, lazy, Suspense } from "react"
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from "react-icons/ri"
import { IoSend } from "react-icons/io5"
import { useSocket } from "@/context/SocketContext"
import { useAppStore } from "@/store"
import { apiClient } from "@/lib/api-client"
import { UPLOAD_FILE_ROUTE } from "@/utils/constants"
import { useEmojiPicker } from "@/hooks/useEmojiPicker"
import { useTheme } from "@/context/ThemeContext"

// Lazy load the emoji picker to reduce initial bundle size
const EmojiPicker = lazy(() => import("emoji-picker-react"))

const MessageBar = () => {
    const fileInputRef = useRef()
    const socket = useSocket()
    const { selectedChatType, selectedChatData, setIsUploading, setFileUploadProgress, userInfo } = useAppStore()
    const { isDark } = useTheme()
    const [message, setMessage] = useState("")
      // Use optimized emoji picker hook
    const {
        isOpen: emojiPickerOpen,
        isLoaded: emojiPickerLoaded,
        pickerRef: emojiRef,
        buttonRef: emojiButtonRef,
        togglePicker: toggleEmojiPicker
    } = useEmojiPicker()

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    const handleSendMessage = async () => {
        if (message.trim()) {
            if (selectedChatType === "contact") {
                socket.emit("sendMessage", {
                    sender: userInfo.id,
                    content: message,
                    recipient: selectedChatData._id,
                    messageType: "text",
                    fileUrl: undefined,
                })
            } else if (selectedChatType === "channel") {
                socket.emit("send-channel-message", {
                    sender: userInfo.id,
                    content: message,
                    messageType: "text",
                    fileUrl: undefined,
                    channelId: selectedChatData._id,
                })
            }

            setMessage("")
        }
    }

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0]
            if (file) {
                const formData = new FormData()
                formData.append("file", file)
                setIsUploading(true)
                const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
                    withCredentials: true,
                    onUploadProgress: data => {
                        setFileUploadProgress(Math.round((100 * data.loaded) / data.total))
                    }
                })

                if (response.status === 200 && response.data) {
                    setIsUploading(false)
                    if (selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                        })
                    } else if (selectedChatType === "channel") {
                        socket.emit("send-channel-message", {
                            sender: userInfo.id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                            channelId: selectedChatData._id,
                        })
                    }
                }
            }
            console.log({ file })
        } catch (error) {
            console.log(error)
        }
    }    
    return <div className="h-10 bg-card border-t border-border flex justify-center items-center px-40 mb-6 gap-6">
        <div className="flex-1 flex bg-input rounded-md items-center gap-5 pr-5 mt-6">
            <input
                type="text"
                className="flex-1 p-3 bg-transparent text-foreground rounded-md focus:border-none focus:outline-none placeholder:text-muted-foreground"
                placeholder="Enter Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage()
                    }
                }}
            />
            <button className="text-muted-foreground focus:border-none focus:outline-none hover:text-foreground duration-300 transition-all" onClick={handleAttachmentClick}>
                <GrAttachment className="text-2xl" />
            </button>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />            <div className="relative flex">
                <button 
                    ref={emojiButtonRef}
                    className="focus:border-none focus:outline-none text-muted-foreground hover:text-foreground duration-300 transition-all" 
                    onClick={toggleEmojiPicker}
                >
                    <RiEmojiStickerLine className="text-2xl" />
                </button>
                {emojiPickerOpen && (
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <Suspense fallback={
                            <div className="w-80 h-96 bg-popover rounded-lg border border-border flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                            </div>
                        }>
                            <EmojiPicker 
                                theme={isDark ? "dark" : "light"} 
                                open={emojiPickerOpen} 
                                onEmojiClick={handleAddEmoji} 
                                autoFocusSearch={false}
                                lazyLoadEmojis={true}
                                previewConfig={{
                                    showPreview: false
                                }}
                                skinTonesDisabled={true}
                                searchPlaceholder="Search emojis..."
                                width={320}
                                height={400}
                            />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md items-center justify-center p-3 focus:border-none focus:outline-none duration-300 transition-all mt-6" onClick={handleSendMessage}>
            <IoSend className="text-2xl" />
        </button>
    </div>
}

export default MessageBar