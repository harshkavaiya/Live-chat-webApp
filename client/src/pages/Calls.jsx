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
import { useEffect } from "react";
import useHomePageNavi from "../store/useHomePageNavi";
import NewCallDialog from "../components/PopUpDialog/NewCallDialog";
import useContactList from "../store/useContactList";

const Calls = () => {
  const { authUser } = useAuthStore();
  const { startCall } = useVideoCall();
  const { activePage } = useHomePageNavi.getState();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`call-${authUser._id}`],
    queryFn: async () => {
      let res = await axiosInstance.get(`/call/get`);
      return res.data || [];
    },
  });
  const { setDialogOpen } = useContactList();
  const Opendialog = () => {
    setDialogOpen(true);

    document.getElementById("newCall").showModal();
  };

  useEffect(() => {
    refetch();
  }, [startCall]);

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
          </div>
        ) : (
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
                  // value={searchQuery}
                  // onChange={handleSearchChange}
                  className="input input-primary h-9 w-full pl-10"
                  placeholder="Search messages..."
                />
              </div>
            </div>

            {/* messeages list */}
            <div className="overflow-y-auto overflow-x-hidden">
              {data?.map((i, idx) => {
                const { callerId, receiverId, callType, status, startedAt } = i;
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
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col ml-3 gap-1">
                        <p
                          className={`text-lg font-semibold ${
                            status == "missed" && " text-red-500"
                          }`}
                        >
                          {authUser._id ==callerId._id ?receiverId.fullname:callerId.fullname}
                        </p>
                        <div className="text-xs flex items-center gap-1 text-gray-500">
                          {authUser._id != callerId._id ? (
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
                          onClick={() => {
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
                <div className="divider text-xs">end-to-end encrypted</div>
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
          <div className="btn w-16 h-16 shadow-lg rounded-full m-1">
            <MdAddIcCall size={23} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Calls;
