import ChatInput from "../components/chat/ChatInput";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessage from "../components/chat/ChatMessage";
import { memo, useEffect, useState } from "react";
import Profile from "./Profile";
import ImagePreview from "../components/ImagePreview/ImagePreview";
import useMediaStore from "../store/useMediaStore";
import useMessageStore from "../store/useMessageStore";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";

const ChatPage = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { mediaPreview } = useMediaStore();
  const { setMessages, currentChatingUser } = useMessageStore();
  const { data, isLoading } = useQuery({
    queryKey: [`chat-${currentChatingUser}`],
    queryFn: async () => {
      let res = await axiosInstance.get(`/message/chat/${currentChatingUser}`);
      return res.data;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [setMessages, data, isLoading]);

  return (
    <div className="relative">
      {mediaPreview && <ImagePreview />}
      {!mediaPreview && (
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
      )}
      {/* Profile */}
      {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}
    </div>
  );
};

export default memo(ChatPage);
