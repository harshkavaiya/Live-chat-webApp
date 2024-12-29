import ChatInput from "../components/chat/ChatInput";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessage from "../components/chat/ChatMessage";
import { useState } from "react";
import Profile from "./Profile";
import { useParams } from "react-router-dom";
import useMessageStore from "../store/useMessageStore";

const ChatPage = () => {
  const id = "676e285fa50bb46cb7b5effd";
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="relative">
      <div className="bg-base-100 h-screen">
        {/* Header */}
        <div className="w-full h-[10%]">
          <ChatHeader
            receiver={id}
            setIsProfileOpen={setIsProfileOpen}
            isProfileOpen={isProfileOpen}
          />
        </div>
        {/* Chat Messages */}
        <div className="w-full h-[80%]">
          <ChatMessage receiver={id} />
        </div>
        {/* Input Area */}
        <div className="w-full h-[10%]">
          <ChatInput receiver={id} />
        </div>
      </div>
      {/* Profile */}
      {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}
    </div>
  );
};

export default ChatPage;
