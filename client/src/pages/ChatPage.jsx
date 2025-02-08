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
import Share from "../components/share/share";
import useFunctionStore from "../store/useFuncationStore";
import Location from "../components/Location";
import SendFilePreview from "../components/SendDataPreview/SendFilePreview";
import useAuthStore from "../store/useAuthStore";

const ChatPage = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { mediaPreview } = useMediaStore();
  const {
    isMessageShare,
    isLocationLoading,
    location,
    locationClose,
    locationShare,
    galleryData
  } = useFunctionStore();
  const { setMessages, currentChatingUser,hanldeVote } = useMessageStore();
  const { socket } = useAuthStore();
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

  useEffect(() => {
    if (socket) {
      socket.on("vote", hanldeVote);

      return () => {
        socket.off("vote");
      };
    }
  }, [socket]);

  return (
    <>
      <div className="relative w-full h-screen mb-52 ">
        {mediaPreview && <ImagePreview />}
        {!mediaPreview && (
          <div className="bg-base-100 h-full">
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
      {/* share data */}
      {isMessageShare && <Share />}
      {!isLocationLoading && location.length > 0 && (
        <Location
          latitude={location[0]}
          longitude={location[1]}
          close={locationClose}
          shareLocation={() => locationShare()}
        />
      )}
      {/* Gallery Data preview*/}
      {galleryData.length > 0 && <SendFilePreview />}
    </>
  );
};

export default memo(ChatPage);
