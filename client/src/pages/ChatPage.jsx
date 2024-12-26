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
      <div className="flex flex-col max-h-screen bg-base-100">
        {/* Header */}
        <ChatHeader
          receiver={id}
          setIsSelectMessage={setIsSelectMessage}
          setIsProfileOpen={setIsProfileOpen}
          isProfileOpen={isProfileOpen}
        />
        {/* Chat Messages */}
        <ChatMessage
          receiver={id}
          isSelectMessage={isSelectMessage}
          setIsSelectMessage={setIsSelectMessage}
        />
        {/* Input Area */}
        <ChatInput receiver={id} />
      </div>
      {/* Profile */}
      {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}
    </>
  );
};

export default ChatPage;
