import React from 'react';
import ChatHeader from './components/chat-header';
import MessageBar from './components/chat-header/message-bar';
import MessageContainer from './components/chat-header/message-container';

const ChatContainer = () => {
    return (
        <div className="fixed top-0 h-[100vh] w-[100vw] flex flex-col bg-[#1c1d25] md:static md:flex-1">
            <h1>Chat Container</h1>
            {/* Add your chat components here */}
            <ChatHeader/>
            <MessageContainer/>
            <MessageBar/>
        </div>
    );
};

export default ChatContainer;