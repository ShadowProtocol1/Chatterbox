import ChatHeader from "./components/chat-header"
import MessageBar from "./components/message-bar"
import MessageContainer from "./components/message-container"

const ChatContainer = () => {
    return <div className="flex-1 bg-card border-l border-border flex flex-col h-[100vh] w-full md:w-auto">
        <ChatHeader />
        <MessageContainer />
        <MessageBar />
    </div>
}

export default ChatContainer