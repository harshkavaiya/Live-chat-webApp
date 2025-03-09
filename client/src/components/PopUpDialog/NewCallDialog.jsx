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
    console.log(filteredData);
  };
  useEffect(() => {
    if (isOpenDialog && contacts.length === 0) {
      getContactsList();
    }
  }, [isOpenDialog, contacts, getContactsList]);
  const { startCall } = useVideoCall();
  return (
    <>
      <VideoCall />
      <AudioCall />
      <dialog id="newCall" className="modal z-0">
        <div className="sm:modal-box w-full h-full bg-base-100 relative gap-2 overflow-hidden sm:max-w-xl p-5 flex flex-col">
          {/* header */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <FaArrowLeft
                size={18}
                className="cursor-pointer"
                onClick={closeDialog}
              />
              <span className="flex flex-col items-center justify-center">
                <h3 className="font-bold text-lg">New Call</h3>
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
              className="absolute inset-y-0 h-full left-4"
            />
            <input
              type="search"
              className="input w-full input-bordered pl-12"
              placeholder="Search name or phone number"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {/* all Contacts show here */}
          <div className="overflow-y-auto scroll-smooth relative h-full flex flex-col gap-1 py-2 mt-1">
            {isloading ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <AiOutlineLoading3Quarters size={30} className="animate-spin" />
              </div>
            ) : filteredData.length === 0 ? (
              <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                No contacts found
              </p>
            ) : (
              filteredData.map((i, idx) => (
                <div
                  key={idx}
                  className="flex  items-center justify-between p-1 rounded-btn sm:hover:bg-primary/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-base-300 grid w-14 h-14 place-items-center rounded-full overflow-hidden">
                      <img
                        src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                        alt="user"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-px">
                      <p className="font-semibold">{i.savedName}</p>
                      <p className="text-sm">{i.about}</p>
                    </div>
                  </div>
                  <div className="sm:mr-3 flex items-center gap-2">
                    <span
                      className="w-8 h-8 btn btn-ghost min-h-0 rounded-full grid place-content-center sm:hover:bg-primary/40 hover:bg-transparent"
                      onClick={() => {
                        startCall(i._id, "audio");
                        document.getElementById("audio_call_modal").showModal();
                      }}
                    >
                      <BiSolidPhoneCall size={18} />
                    </span>

                    <span
                      className="w-8 h-8 btn btn-ghost min-h-0 rounded-full grid place-content-center sm:hover:bg-primary/40 hover:bg-transparent"
                      onClick={() => {
                        startCall(i._id, "video");
                        document.getElementById("video_call_modal").showModal();
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
