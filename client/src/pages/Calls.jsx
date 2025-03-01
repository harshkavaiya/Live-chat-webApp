import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiPhoneIncoming } from "react-icons/fi";
import { MdCall } from "react-icons/md";
import { FaVideo } from "react-icons/fa6";
import { FiPhoneOutgoing } from "react-icons/fi";
import { formatMessageTime } from "../function/TimeFormating";
import { useQuery } from "@tanstack/react-query";
import useVideoCall from "../store/useVideoCall";
import axiosInstance from "../lib/axiosInstance";
import useAuthStore from "../store/useAuthStore";

const Calls = () => {
  const { authUser } = useAuthStore();
  const [callName, setcallerName] = useState("");
  const [remoteID, setRemoteId] = useState(null);
  const [calltype, setCalltype] = useState(null);
  const [ready, setReady] = useState(false);
  const { startCall } = useVideoCall();

  const { data, isLoading } = useQuery({
    queryKey: [`call-${authUser._id}`],
    queryFn: async () => {
      let res = await axiosInstance.get(`/call/get`);
      return res.data || [];
    },
    staleTime: Infinity,
  });

  const VcallsHandler = (data) => {
    const { callerId, receiverId } = data;
    let user = authUser._id == callerId._id ? callerId : receiverId;
    setcallerName(user.fullname);
    setRemoteId(user._id);
    setCalltype(data.callType);
    document.getElementById("video_call_modal").showModal();
    setReady(true);
  };

  const callsHandler = (data) => {
    const { callerId, receiverId } = data;
    let user = authUser._id == callerId._id ? callerId : receiverId;
    setcallerName(user.fullname);
    setRemoteId(user._id);
    setCalltype(data.callType);
    document.getElementById("audio_call_modal").showModal();
    setReady(true);
  };

  useEffect(() => {
    if (remoteID && ready) {
      startCall(remoteID, calltype);
      setReady(false);
    }
  }, [remoteID, ready]);

  return (
    <div className="flex flex-col h-screen">
      {/* user message */}
      <div className="flex-1 h-0 flex flex-col">
        <div className="text-lg flex items-center justify-between font-bold pl-2 py-2 cursor-default">
          <span className="flex items-center gap-px">
            Calls
            <div className="badge p-0 ml-1 w-5 h-5 badge-primary">
              {data?.length}
            </div>
          </span>
          {/* search */}
          <div className="relative w-full px-4">
            <span className="absolute inset-y-0 left-7 flex items-center text-gray-500">
              <CiSearch size={20} />
            </span>
            <input
              type="search"
              className="input input-primary h-9 w-full pl-10"
              placeholder="Search messages..."
            />
          </div>
        </div>

        {/* messeages list */}
        <div className="overflow-y-auto overflow-x-hidden">
          {data?.map((i, idx) => {
            const { callerId, callType, status, startedAt } = i;
            return (
              <div
                key={idx}
                className={`flex justify-between pl-4 md:border-b pr-2 border-primary/20 py-2 transition-all duration-75 group hover:bg-primary/10 items-center
                ${idx == data.length - 1 && "border-b"}`}
              >
                <div className="flex items-center">
                  <div className="bg-base-300 grid w-14 h-14 border-2 border-primary place-items-center rounded-full overflow-hidden">
                    <img
                      src={
                        callerId.profilePic ||
                        "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                      }
                      alt="user"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col ml-3 gap-1">
                    <p
                      className={`text-lg font-semibold ${
                        i.misscall && " text-red-500"
                      }`}
                    >
                      {callerId.fullname}
                    </p>
                    <div className="text-xs flex items-center gap-1 text-gray-500">
                      {authUser._id == callerId ? (
                        <FiPhoneIncoming
                          size={14}
                          className={`${
                            status == "missed"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        />
                      ) : (
                        <FiPhoneOutgoing
                          size={14}
                          className={`${
                            status == "missed"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        />
                      )}
                      <p>{formatMessageTime(startedAt)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  {callType === "video" ? (
                    <FaVideo
                      size={20}
                      className="cursor-pointer"
                      onClick={() => VcallsHandler(i)}
                    />
                  ) : (
                    <MdCall
                      size={20}
                      className="cursor-pointer"
                      onClick={() => callsHandler(i)}
                    />
                  )}
                </div>
              </div>
            );
          })}
          <div className="mb-36 md:mb-5">
            <div className="divider text-xs">end-to-end encrypted</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calls;
