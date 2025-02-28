import { memo, useEffect, useState } from "react";
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

  const {
    isMessageShare,
    isLocationLoading,
    location,
    locationClose,
    locationShare,
    galleryData,
  } = useFunctionStore();
  const { setMessages, messages, currentChatingUser } = useMessageStore();
  const { authUser } = useAuthStore();

  // Fetch chat message
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
      getNextPageParam: (lastPage) => {
        return lastPage?.length ? lastPage[0]?._id : false;
      },
    });

  // Update messages when data changes
  useEffect(() => {
    if (data?.pages) {
      const uniqueMessages = [
        ...new Map(data.pages.flat().map((msg) => [msg._id, msg])).values(),
      ];
      setMessages(uniqueMessages.reverse());
    }
  }, [data, setMessages]);

  return (
    <div className="relative w-full h-screen flex flex-col">
      {mediaPreview ? (
        <ImagePreview />
      ) : (
        <>
          {/* Header */}
          <div className="w-full h-[10%] sm:h-[8%] border-b border-gray-300">
            <ChatHeader
              setIsProfileOpen={setIsProfileOpen}
              isProfileOpen={isProfileOpen}
            />
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto">
            <ChatMessage
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
            />
          </div>

          {/* Input Area */}
          <div className="w-full h-[10%] sm:h-[12%] border-t border-gray-300">
            {currentChatingUser.type === "Group" ? (
              currentChatingUser.members.some((user) => user._id === authUser._id) ? (
                <ChatInput />
              ) : (
                <p className="bg-gray-100 text-center text-lg py-4 text-gray-600">
                  You are not a member of this group.
                </p>
              )
            ) : (
              <ChatInput />
            )}
          </div>
        </>
      )}

      {/* Profile */}
      {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}

      {/* Share Data */}
      {isMessageShare && <Share />}

      {/* Location Preview */}
      {!isLocationLoading && location.length > 0 && (
        <Location
          latitude={location[0]}
          longitude={location[1]}
          close={locationClose}
          shareLocation={locationShare}
        />
      )}

      {/* Gallery Data Preview */}
      {galleryData.length > 0 && <SendFilePreview />}
    </div>
  );
};

export default memo(ChatPage);
