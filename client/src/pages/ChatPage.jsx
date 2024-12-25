import ChatInput from "../components/chat/ChatInput";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessage from "../components/chat/ChatMessage";
import { useState } from "react";
import Profile from "./Profile";

const ChatPage = () => {
  const [isSelectMessage, setIsSelectMessage] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col max-h-screen bg-base-100">
        {/* Header */}
        <ChatHeader
          setIsSelectMessage={setIsSelectMessage}
          setIsProfileOpen={setIsProfileOpen}
          isProfileOpen={isProfileOpen}
        />
        {/* Chat Messages */}
        <ChatMessage
          isSelectMessage={isSelectMessage}
          setIsSelectMessage={setIsSelectMessage}
        />
        {/* Input Area */}
        <ChatInput />
      </div>
      {/* Profile */}
      {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}
    </>
  );
};

export default ChatPage;
