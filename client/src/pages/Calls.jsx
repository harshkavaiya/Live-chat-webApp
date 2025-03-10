import { memo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  // Fetch chat messages using TanStack Query
  const { data, isLoading } = useQuery({
    queryKey: [`chat-${currentChatingUser?._id}`],
    queryFn: async () => {
      if (!currentChatingUser?._id) return [];
      const res = await axiosInstance.get(
        `/message/chat/${currentChatingUser._id}?type=${currentChatingUser.type}`
      );
      return res.data || [];
    },
    enabled: !!currentChatingUser?._id,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data, setMessages]);

  return (
    <>
      <NewCallDialog />
      <div className="flex flex-col h-screen">
        {/* user message */}
        {isLoading ? (
          <div className="flex-1 h-0 flex flex-col">
            <div className="overflow-y-auto scrollbar-hide overflow-x-hidden">
              {Array(10)
                .fill("")
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between pl-4 pr-2 py-2 items-center border-b border-primary/20"
                  >
                    <div className="flex items-center">
                      <div className="skeleton w-14 h-14 rounded-full"></div>
                      <div className="flex flex-col ml-3 gap-2">
                        <div className="skeleton h-5 w-32"></div>
                        <div className="skeleton h-4 w-16"></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                      <div className="skeleton h-7 w-7 rounded-full"></div>
                    </div>
                  </div>
                ))}
              <div className="mb-36 md:mb-5">
                <div className="divider text-xs">end-to-end encrypted</div>
              </div>
            </div>
            {/* Input Area */}
            <div className="h-[10%] w-full ">
              {currentChatingUser?.type !== "Group" ||
              currentChatingUser?.members.some(
                (user) => user._id === authUser._id
              ) ? (
                <ChatInput />
              ) : (
                <p className="bg-base-100 border-t border-base-300 text-xl w-full h-full flex items-center justify-center text-primary-content">
                  You are not a member of this group.
                </p>
              )}
            </div>
          </>
        )}
        {/* Profile */}
        {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}
      </div>

      {/* Share Data */}
      {isMessageShare && <Share />}
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
    </>
  );
};

export default memo(ChatPage);
