import ChatInput from "../components/chat/ChatInput";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessage from "../components/chat/ChatMessage";
import { useEffect, useState } from "react";
import Profile from "./Profile";
import { Navigate, useParams } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useMessageStore from "../store/useMessageStore";

const ChatPage = () => {
  const { id } = useParams();
  const [isSelectMessage, setIsSelectMessage] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isCheckingAuth && !authUser) return <Navigate to={"/Login"} />;
  return (
    <>
      <div className="bg-base-100 h-screen">
        {/* Header */}
        <div className="w-full h-[10%]">
          <ChatHeader
            receiver={id}
            setIsSelectMessage={setIsSelectMessage}
            setIsProfileOpen={setIsProfileOpen}
            isProfileOpen={isProfileOpen}
          />
        </div>
        {/* Chat Messages */}
        <div className="w-full h-[80%]">
          <ChatMessage
            receiver={id}
            isSelectMessage={isSelectMessage}
            setIsSelectMessage={setIsSelectMessage}
          />
        </div>
        {/* Input Area */}
        <div className="w-full h-[10%]">
          <ChatInput receiver={id} />
        </div>
      </div>
      {/* Profile */}
      {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}
    </>
  );
};

export default ChatPage;
