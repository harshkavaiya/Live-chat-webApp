import { memo, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useMediaStore from "../store/useMediaStore";
import useMessageStore from "../store/useMessageStore";
import useFunctionStore from "../store/useFuncationStore";
import useAuthStore from "../store/useAuthStore";
import axiosInstance from "../lib/axiosInstance";
import ChatInput from "../components/chat/ChatInput";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessage from "../components/chat/ChatMessage";
import Profile from "./Profile";
import ImagePreview from "../components/ImagePreview/ImagePreview";
import Share from "../components/share/Share";
import Location from "../components/Location";
import SendFilePreview from "../components/SendDataPreview/SendFilePreview";

const ChatPage = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { mediaPreview } = useMediaStore();
  const { isMessageShare, isLocationLoading, location, locationClose, locationShare, galleryData } = useFunctionStore();
  const { setMessages, messages, currentChatingUser } = useMessageStore();
  const { authUser } = useAuthStore();

  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  // Fetch chat messages
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [`chat-${currentChatingUser?._id}`],
    queryFn: async ({ pageParam = 0 }) => {
      if (!currentChatingUser?._id) return [];
      const res = await axiosInstance.get(
        `/message/chat/${currentChatingUser._id}?lastMessageId=${pageParam}&Datalength=${messages.length}&type=${currentChatingUser.type}`
      );
      return res.data || [];
    },
    enabled: !!currentChatingUser?._id,
    staleTime: Infinity,
    getNextPageParam: (lastPage) => (lastPage?.length ? lastPage[0]?._id : false),
  });

  // Update messages when data changes
  useEffect(() => {
    if (data?.pages) {
      const uniqueMessages = [...new Map(data.pages.flat().map((msg) => [msg._id, msg])).values()];
      setMessages(uniqueMessages.reverse());
    }
  }, [data, setMessages]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <div className="relative w-full h-screen flex flex-col">
        {mediaPreview ? (
          <ImagePreview />
        ) : (
          <>
            {/* Header */}
            <div className="w-full h-[10%] flex-none">
              <ChatHeader setIsProfileOpen={setIsProfileOpen} isProfileOpen={isProfileOpen} />
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-2">
              <ChatMessage
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
              />
              <div ref={bottomRef} /> {/* Auto-scroll target */}
            </div>

            {/* Input Area */}
            <div className="w-full h-[10%] fixed bottom-0 flex items-center justify-center border-t border-gray-300 p-2">
              {currentChatingUser?.type === "Group" ? (
                currentChatingUser.members.some((user) => user._id === authUser._id) ? (
                  <ChatInput />
                ) : (
                  <p className="text-gray-500 text-sm">You are not a member of this group.</p>
                )
              ) : (
                <ChatInput />
              )}
            </div>
          </>
        )}

        {/* Profile Modal */}
        {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}

        {/* Share Data */}
        {isMessageShare && <Share />}
        {!isLocationLoading && location.length > 0 && (
          <Location latitude={location[0]} longitude={location[1]} close={locationClose} shareLocation={locationShare} />
        )}
        {galleryData.length > 0 && <SendFilePreview />}
      </div>
    </>
  );
};

export default memo(ChatPage);
