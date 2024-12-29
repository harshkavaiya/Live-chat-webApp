import ChatInput from "../components/chat/ChatInput";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessage from "../components/chat/ChatMessage";
import { useState } from "react";
import Profile from "./Profile";

const ChatPage = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="relative">
      <div className="bg-base-100 h-screen">
        {/* Header */}
        <div className="w-full h-[10%]">
          <ChatHeader
            setIsProfileOpen={setIsProfileOpen}
            isProfileOpen={isProfileOpen}
          />
        </div>
        {/* Chat Messages */}
        <div className="w-full h-[80%]">
          <ChatMessage />
        </div>
        {/* Input Area */}
        <div className="w-full h-[10%]">
          <ChatInput />
        </div>
      </div>
      {/* Profile */}
      {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}
    </div>
  );
};

export default ChatPage;
