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
import { MdAddIcCall } from "react-icons/md";
import { useEffect, useState } from "react";
import useHomePageNavi from "../store/useHomePageNavi";
import NewCallDialog from "../components/PopUpDialog/NewCallDialog";
import useContactList from "../store/useContactList";

const Calls = () => {
  const { authUser } = useAuthStore();
  const { startCall, setUserDetail } = useVideoCall();
  const { activePage } = useHomePageNavi.getState();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`call-${authUser._id}`],
    queryFn: async () => {
      let res = await axiosInstance.get(`/call/get`);
      return res.data || [];
    },
  });
  const { setDialogOpen } = useContactList();
  const [searchTerm, setSearchTerm] = useState("");

  const Opendialog = () => {
    setDialogOpen(true);
    document.getElementById("newCall").showModal();
  };

  useEffect(() => {
    refetch();
  }, [startCall]);

  const filteredData = data?.filter((i) => {
    const callerFullName =
      authUser._id.toString() === i.callerId._id.toString()
        ? i.receiverId.fullname
        : i.callerId.fullname;

    return callerFullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <NewCallDialog />
      <div className="flex flex-col h-screen">
        {/* user message */}
        {isLoading ? (
          <div className="flex flex-1 flex-col h-0">
            <div className="overflow-x-hidden overflow-y-auto scrollbar-hide">
              {Array(10)
                .fill("")
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="flex border-b border-primary/20 justify-between items-center pl-4 pr-2 py-2"
                  >
                    <div className="flex items-center">
                      <div className="h-14 rounded-full w-14 skeleton"></div>
                      <div className="flex flex-col gap-2 ml-3">
                        <div className="h-5 w-32 skeleton"></div>
                        <div className="h-4 w-16 skeleton"></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                      <div className="h-7 rounded-full w-7 skeleton"></div>
                    </div>
                  </div>
                ))}
              <div className="mb-36 md:mb-5">
                <div className="text-xs divider">end-to-end encrypted</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col h-0">
            <div className="flex justify-between text-lg cursor-default font-bold items-center pl-2 py-2">
              <span className="flex gap-px items-center">
                Calls
                <div className="badge badge-primary h-5 p-0 w-5 ml-1">
                  {filteredData?.length}
                </div>
              </span>
              {/* search */}
              <div className="w-full px-4 relative">
                <span className="flex text-gray-500 absolute inset-y-0 items-center left-7">
                  <CiSearch size={20} />
                </span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-primary h-9 font-normal w-full pl-10"
                  placeholder="Search Name"
                />
              </div>
            </div>

            {/* messeages list */}
            <div className="overflow-x-hidden overflow-y-auto">
              {filteredData?.map((i, idx) => {
                const { callerId, receiverId, callType, status, startedAt } = i;
                return (
                  <div
                    key={idx}
                    className={`flex justify-between pl-4 md:border-b pr-2 border-primary/20 py-2 transition-all duration-75 group hover:bg-primary/10 items-center
                ${idx == filteredData.length - 1 && "border-b"}`}
                  >
                    <div className="flex items-center">
                      <div className="grid bg-base-300 border-2 border-primary h-14 rounded-full w-14 overflow-hidden place-items-center">
                        <img
                          src={
                            authUser._id.toString() === callerId._id.toString()
                              ? receiverId.profilePic ||
                                "data:image/png;base64,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"
                              : callerId.profilePic ||
                                "data:image/png;base64,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"
                          }
                          alt="user"
                          className="h-full w-full object-center object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1 ml-3">
                        <p
                          className={`text-lg font-semibold ${
                            status == "missed" && " text-red-500"
                          }`}
                        >
                          {authUser._id.toString() === callerId._id.toString()
                            ? receiverId.fullname
                            : callerId.fullname}
                        </p>
                        <div className="flex text-gray-500 text-xs gap-1 items-center">
                          {authUser._id != callerId._id ? (
                            <FiPhoneIncoming
                              size={14}
                              className={`${
                                status == "missed" || status == "rejected"
                                  ? "text-red-500"
                                  : "text-green-600"
                              }`}
                            />
                          ) : (
                            <FiPhoneOutgoing
                              size={14}
                              className={`${
                                status == "missed" || status == "rejected"
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
                          onClick={() => {
                            setUserDetail(
                              authUser._id.toString() ===
                                callerId._id.toString()
                                ? receiverId.fullname
                                : callerId.fullname,
                              authUser._id.toString() ===
                                callerId._id.toString()
                                ? receiverId.profilePic
                                : callerId.profilePic
                            );
                            startCall(
                              callerId._id == authUser._id
                                ? receiverId._id
                                : callerId._id,
                              callType
                            );

                            document
                              .getElementById("video_call_modal")
                              .showModal();
                          }}
                        />
                      ) : (
                        <MdCall
                          size={20}
                          className="cursor-pointer"
                          onClick={() => {
                            setUserDetail(
                              authUser._id.toString() ===
                                callerId._id.toString()
                                ? receiverId.fullname
                                : callerId.fullname,
                              authUser._id.toString() ===
                                callerId._id.toString()
                                ? receiverId.profilePic
                                : callerId.profilePic
                            );
                            startCall(
                              callerId._id == authUser._id
                                ? receiverId._id
                                : callerId._id,
                              callType
                            );
                            document
                              .getElementById("audio_call_modal")
                              .showModal();
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="mb-36 md:mb-5">
                <div className="text-xs divider">end-to-end encrypted</div>
              </div>
            </div>
          </div>
        )}
        {/* menus */}
        <div
          className={`${
            activePage === "call" ? "block" : "hidden"
          } fixed sm:absolute right-2 bottom-20 sm:bottom-1`}
          onClick={Opendialog}
        >
          <div className="btn h-16 m-1 rounded-full shadow-lg w-16">
            <MdAddIcCall size={23} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Calls;
