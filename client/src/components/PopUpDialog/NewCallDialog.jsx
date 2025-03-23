import React, { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { BiSolidPhoneCall } from "react-icons/bi";
import { FaVideo } from "react-icons/fa";
import useSearch from "../../function/SearchFunc";
import useContactList from "../../store/useContactList";
import VideoCall from "../call/VideoCall";
import AudioCall from "../call/AudioCall";
import useVideoCall from "../../store/useVideoCall";

const NewCallDialog = () => {
  const { getContactsList, isOpenDialog, setDialogOpen, contacts, isloading } =
    useContactList();
  const { searchQuery, filteredData, handleSearchChange } = useSearch(contacts);
  const closeDialog = () => {
    setDialogOpen(false);
    document.getElementById("newCall").close();
  };
  useEffect(() => {
    if (isOpenDialog && contacts.length === 0) {
      getContactsList();
    }
  }, [isOpenDialog, contacts, getContactsList]);
  const { startCall, setUserDetail } = useVideoCall();
  return (
    <>
      <VideoCall />
      <AudioCall />
      <dialog id="newCall" className="modal z-0">
        <div className="flex flex-col bg-base-100 h-full p-5 w-full gap-2 overflow-hidden relative sm:max-w-xl sm:modal-box">
          {/* header */}
          <div className="flex justify-between items-center">
            <span className="flex gap-2 items-center">
              <FaArrowLeft
                size={18}
                className="cursor-pointer"
                onClick={closeDialog}
              />
              <span className="flex flex-col justify-center items-center">
                <h3 className="text-lg font-bold">New Call</h3>
                <div className="badge badge-ghost rounded-btn text-xs">
                  {filteredData.length} contacts
                </div>
              </span>
            </span>
          </div>
          {/* search bar */}
          <div className="relative">
            <IoMdSearch
              size={20}
              className="h-full absolute inset-y-0 left-4"
            />
            <input
              type="search"
              className="input input-bordered w-full pl-12"
              placeholder="Search name or phone number"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {/* all Contacts show here */}
          <div className="flex flex-col h-full gap-1 mt-1 overflow-y-auto py-2 relative scroll-smooth">
            {isloading ? (
              <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 transform">
                <AiOutlineLoading3Quarters size={30} className="animate-spin" />
              </div>
            ) : filteredData.length === 0 ? (
              <p className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 transform">
                No contacts found
              </p>
            ) : (
              filteredData.map((i, idx) => (
                <div
                  key={idx}
                  className="flex justify-between p-1 rounded-btn cursor-pointer items-center sm:hover:bg-primary/10"
                >
                  <div className="flex gap-3 items-center">
                    <div className="grid bg-base-300 h-14 rounded-full w-14 overflow-hidden place-items-center">
                      <img
                        src={
                          i.profilePic ||
                          "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                        }
                        alt="user"
                        className="h-full w-full object-center object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-px">
                      <p className="font-semibold">{i.savedName}</p>
                      <p className="text-sm">{i.about}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center sm:mr-3">
                    <span
                      className="grid btn btn-ghost h-8 rounded-full w-8 hover:bg-transparent min-h-0 place-content-center sm:hover:bg-primary/40"
                      onClick={() => {
                        setUserDetail(i.savedName, i.profilePic);
                        startCall(i._id, "audio");
                        document.getElementById("audio_call_modal").showModal();
                        document.getElementById("newCall").close();
                      }}
                    >
                      <BiSolidPhoneCall size={18} />
                    </span>

                    <span
                      className="grid btn btn-ghost h-8 rounded-full w-8 hover:bg-transparent min-h-0 place-content-center sm:hover:bg-primary/40"
                      onClick={() => {
                        setUserDetail(i.savedName, i.profilePic);
                        startCall(i._id, "video");
                        document.getElementById("video_call_modal").showModal();
                        document.getElementById("newCall").close();
                      }}
                    >
                      <FaVideo size={15} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NewCallDialog;
