import { useAppStore } from "@/store"
import { HOST, GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES } from "@/utils/constants"
import { useEffect, useRef, useState } from "react"
import { MdFolderZip } from "react-icons/md"
import { apiClient } from "@/lib/api-client"
import moment from "moment"
import { IoCloseSharp, IoArrowDown } from "react-icons/io5"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"
import { LoadingScreen } from "@/components/loading-screen"

const MessageContainer = () => {
    const scrollRef = useRef()
    const containerRef = useRef()
    const {
        selectedChatType,
        selectedChatData,
        userInfo,
        selectedChatMessages,
        setSelectedChatMessages,
        setFileDownloadProgress,
        setIsDownloading,
        isMessagesLoading,
        setIsMessagesLoading
    } = useAppStore()
    const [showImage, setShowImage] = useState(false)
    const [imageURL, setImageURL] = useState(null)
    const [isUserScrolling, setIsUserScrolling] = useState(false)

    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true)
            try {
                const response = await apiClient.post(
                    GET_ALL_MESSAGES_ROUTE,
                    { id: selectedChatData._id },
                    { withCredentials: true }
                )
                if (response.data.messages) {
                    setSelectedChatMessages(response.data.messages)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsMessagesLoading(false)
            }
        }

        const getChannelMessages = async () => {
            setIsMessagesLoading(true)
            try {
                const response = await apiClient.get(
                    `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
                    { withCredentials: true }
                )
                if (response.data.messages) {
                    setSelectedChatMessages(response.data.messages)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsMessagesLoading(false)
            }
        }
        if (selectedChatData._id) {
            if (selectedChatType === "contact") getMessages()
            else if (selectedChatType === "channel") getChannelMessages()
        }
    }, [selectedChatData, selectedChatType, setSelectedChatMessages])

    // Reset scroll position when switching chats
    useEffect(() => {
        if (selectedChatData) {
            setIsUserScrolling(false)
            // Reset scroll position to bottom immediately when chat changes
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight
            }
        }
    }, [selectedChatData])

    useEffect(() => {
        if (scrollRef.current && !isUserScrolling) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [selectedChatMessages, isUserScrolling])

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50

        if (isAtBottom) {
            setIsUserScrolling(false)
        } else {
            setIsUserScrolling(true)
        }
    }

    const checkIfImage = (filePath) => {
        const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic)$/i
        return imageRegex.test(filePath)
    }

    const renderMessages = () => {
        let lastDate = null

        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timeStamp).format("YYYY-MM-DD")
            const showDate = messageDate != lastDate
            lastDate = messageDate
            return (
                <div key={index}>
                    {showDate && (<div className="text-center text-gray-500 my-2">
                        {moment(message.timestamp).format("LL")}
                    </div>
                    )}
                    {
                        selectedChatType === "contact" && renderDMMessages(message)
                    }

                    {
                        selectedChatType === "channel" && renderChannelMessages(message)
                    }
                </div>
            )
        })
    }

    const downloadFile = async (url) => {
        setIsDownloading(true)
        setFileDownloadProgress(0)
        const response = await apiClient.get(`${HOST}/${url}`, {
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent
                const precentCompleted = Math.round((loaded * 100) / total)
                setFileDownloadProgress(precentCompleted)
            },
        })

        const urlBlob = window.URL.createObjectURL(new Blob([response.data]))

        const link = document.createElement("a")

        link.href = urlBlob
        link.setAttribute("download", url.split("/").pop())
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(urlBlob)
        setIsDownloading(false)
        setFileDownloadProgress(0)
    }

    const renderDMMessages = (message) => (
        <div className={`${message.sender === selectedChatData._id ? "text-left" : " text-right"

            }`}
        >            {message.messageType === "text" && (
            <div
                className={`${message.sender !== selectedChatData._id
                    ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                    : "bg-muted/20 text-foreground border-border"
                    } border inline-block p-2 rounded my-1 max-w-[50%] break-words text-base`}>
                {message.content}
            </div>
        )}            {message.messageType === "file" && <div
            className={`${message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-muted/20 text-foreground border-border"
                } border inline-block p-2 rounded my-1 max-w-[50%] break-words`}>
            {checkIfImage(message.fileUrl) ? (
                <div className="cursor-pointer"
                    onClick={() => {
                        setShowImage(true)
                        setImageURL(message.fileUrl)
                    }}>
                    <img
                        src={`${HOST}/${message.fileUrl}`}
                        height={200}
                        width={200} />
                </div>) : (<div className="flex items-center justify-center gap-2">
                    <span className="text-muted-foreground text-xl bg-border rounded-full p-2">
                        <MdFolderZip />
                    </span>                        <span className="text-sm text-foreground">{message.fileUrl ? message.fileUrl.split('/').pop() : 'Unknown file'}</span>
                    <span className="bg-border hover:bg-purple-600 hover:text-white p-2 text-lg rounded-full cursor-pointer transition-all duration-300 text-foreground" onClick={() => downloadFile(message.fileUrl)}>
                        <IoArrowDown />
                    </span>
                </div>)}
        </div>}            <div className="text-xs text-muted-foreground mb-2">
                {moment(message.timestamp).format("LT")}
            </div>
        </div>
    )

    const renderChannelMessages = (message) => {
        // Add safety check for message.sender
        if (!message.sender) {
            console.warn('Message sender is undefined:', message);
            return null;
        }

        // Additional logging for debugging
        if (!message.sender._id || !message.sender.firstName && !message.sender.email) {
            console.warn('Message sender missing required fields:', message.sender);
        }

        return (
            <div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"
                }`}>
                {
                    message.messageType === "text" && (<div
                        className={`${message.sender._id === userInfo.id
                            ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                            : "bg-muted/20 text-foreground border-border"
                            } border inline-block p-2 rounded my-1 max-w-[50%] break-words ml-9 text-base`}>
                        {message.content}
                    </div>
                    )}                {message.messageType === "file" && <div
                        className={`${message.sender._id === userInfo.id
                            ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                            : "bg-muted/20 text-foreground border-border"
                            } border inline-block p-2 rounded my-1 max-w-[50%] break-words`}>
                        {checkIfImage(message.fileUrl) ? (
                            <div className="cursor-pointer"
                                onClick={() => {
                                    setShowImage(true)
                                    setImageURL(message.fileUrl)
                                }}>
                                <img
                                    src={`${HOST}/${message.fileUrl}`}
                                    height={200}
                                    width={200} />
                            </div>) : (<div className="flex items-center justify-center gap-2">
                                <span className="text-muted-foreground text-xl bg-border rounded-full p-2">
                                    <MdFolderZip />
                                </span>                                <span className="text-sm">{message.fileUrl ? message.fileUrl.split('/').pop() : 'Unknown file'}</span>
                                <span className="bg-border hover:bg-purple-600 hover:text-white p-2 text-lg rounded-full cursor-pointer transition-all duration-300" onClick={() => downloadFile(message.fileUrl)}>
                                    <IoArrowDown />
                                </span>
                            </div>
                        )}
                    </div>
                }
                {
                    message.sender._id !== userInfo.id ? (
                        <div className="flex items-center justify-start gap-3">
                            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                                {message.sender.image && (
                                    <AvatarImage src={`${HOST}/${message.sender.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
                                )}
                                <AvatarFallback className={`uppercase h-8 w-8 text-lg  flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}>
                                    {message.sender.firstName
                                        ? message.sender.firstName.split("").shift()
                                        : (message.sender.email ? message.sender.email.split("").shift() : "U")}
                                </AvatarFallback>
                            </Avatar>                            <span className="text-sm text-muted-foreground">{`${message.sender.firstName || ''} ${message.sender.lastName || ''}`}</span>
                            <span className="text-xs text-muted-foreground">
                                {moment(message.timestamp).format("LT")}
                            </span>
                        </div>
                    ) : (
                        <div className="text-xs text-muted-foreground mt-1">
                            {moment(message.timestamp).format("LT")}
                        </div>
                    )
                }        </div>
        )
    }

    if (isMessagesLoading) {
        return (
            <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 w-full flex items-center justify-center">
                <LoadingScreen
                    message="Loading messages..."
                    overlay={false}
                    className="bg-transparent"
                />
            </div>
        )
    }

    return <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 w-full"
        onScroll={handleScroll}
    >
        {renderMessages()}
        <div ref={scrollRef} />
        {
            showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
                <div>
                    <img src={`${HOST}/${imageURL}`}
                        className="h-[80vh] w-full bg-cover" />
                </div>
                <div className="flex gap-5 fixed top-0 mt-5">
                    <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => downloadFile(imageURL)}>
                        <IoArrowDown />
                    </button>
                    <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => {
                        setShowImage(false)
                        setImageURL(null)
                    }}>
                        <IoCloseSharp />
                    </button>
                </div>
            </div>
        }
    </div>
}

export default MessageContainer