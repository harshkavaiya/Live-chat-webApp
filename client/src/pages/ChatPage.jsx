import ChatInput from "../component/chat/ChatInput";
import ChatHeader from "../component/chat/ChatHeader";
import ChatMessage from "../component/chat/ChatMessage";
import { useState } from "react";

const ChatPage = () => {
  const [isSelectMessage, setIsSelectMessage] = useState(false);
  return (
    <div className="flex flex-col h-screen bg-base-100 ">
      {/* Header */}
      <ChatHeader setIsSelectMessage={setIsSelectMessage} />

      {/* Chat Messages */}
      <ChatMessage isSelectMessage={isSelectMessage} />
      {/* Input Area */}
      <ChatInput />
    </div>
  );
};

export default ChatPage;
