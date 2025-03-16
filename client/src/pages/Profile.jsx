import { IoChevronDownOutline } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";
import { MdOutlineFileDownload, MdDelete } from "react-icons/md";
import {
  IoIosArrowDown,
  IoMdLink,
  IoMdPersonAdd,
  IoMdSearch,
} from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useRef, useState, useEffect } from "react";
import { OpenCloseMenu } from "../function/function";
import { FaVideo } from "react-icons/fa";
import useMediaStore from "../store/useMediaStore";
import useMessageStore from "../store/useMessageStore";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/useAuthStore";
import useGroupStore from "../store/useGroupStore";
import useContactList from "../store/useContactList";
import useSearch from "../function/SearchFunc";
import { RxCross2, RxExit } from "react-icons/rx";
import toast from "react-hot-toast";
import GroupLink from "../components/GroupLink/GroupLink";
import { GoPencil } from "react-icons/go";
import axiosInstance from "../lib/axiosInstance";

const Profile = ({ setIsProfileOpen }) => {
  const { clearChat, handleExport, currentChatingUser } = useMessageStore();
  const {
    removeMember,
    assignAdmin,
    addMember,
    leaveGroup,
    removeAdmin,
    deleteGroup,
    RemoveGroupFromChat,
  } = useGroupStore();
  const mediaRef = useRef();
  const { authUser } = useAuthStore();
  const { chatUserMedia, onDynamicMedia } = useMediaStore();
  const [ismediaRotate, setIsmediaRotate] = useState(false);
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newImg, setNewImg] = useState(null);

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewImg(reader.result);
      };

      reader.readAsDataURL(file);
      document.getElementById("Profile_preview_modal").showModal();
    }
  };
  return (
    <>
      <div className="w-full sm:w-[60%] md:w-[30%] p-2  border border-base-300 h-full mx-auto z-20  overflow-y-scroll bg-base-100 text-base-content/80 font-medium absolute right-0 top-0">
        {/* Header */}
        <div className="relative p-2 border-b text-center border-base-300 ">
          <button className="absolute right-4 top-3">
            <IoClose onClick={() => setIsProfileOpen(false)} size={26} />
          </button>
          <h2 className="text-2xl font-bold ">Profile</h2>
        </div>

        {/* Profile Section */}
        <div className="p-6 flex flex-col items-center border-b border-base-300 ">
          <div className="avatar w-36 h-36 relative">
            <img
              src={
                currentChatingUser.profilePic ||
                "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
              }
              className="object-contain rounded-full"
            />
            <label htmlFor="selectfile">
              <GoPencil className="absolute cursor-pointer right-0 bottom-3 h-8 w-8 bg-primary text-primary-content rounded-full p-1.5" />
            </label>
            <input
              onChange={handleFileChange}
              type="file"
              className="hidden"
              id="selectfile"
            />
          </div>

          <h1 className="mt-4 text-2xl font-semibold">
            {currentChatingUser.fullname}
          </h1>
          {currentChatingUser.type == "Single" && (
            <p className="text-sm ">+91 {currentChatingUser.phone}</p>
          )}
          {currentChatingUser.type == "Group" && (
            <p className="text-sm ">
              Group - {currentChatingUser.members.length} Members
            </p>
          )}
        </div>

        {/* Shared Media */}
        <div className="border-b border-base-300  ">
          <button
            onClick={() => {
              OpenCloseMenu(mediaRef);
              setIsmediaRotate(!ismediaRotate);
            }}
            className="flex items-center justify-between w-full p-4"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">Shared Media</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full">
                {chatUserMedia?.length}
              </span>
            </div>
            <IoChevronDownOutline
              className={`h-5 w-5 transition-all duration-300 ${
                ismediaRotate ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          <div ref={mediaRef} className="p-2 hidden">
            <div className="grid grid-cols-4 gap-3 max-h-[270px] overflow-y-scroll">
              {chatUserMedia?.map((item, i) => (
                <div key={i} className="avatar">
                  <div className="rounded-md">
                    {item.current.type == "image" ? (
                      <img
                        src={item.current.url}
                        loading="lazy"
                        onClick={() => onDynamicMedia(i)}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full relative">
                        <video
                          src={`${item.current.url}#t=2.1`}
                          onClick={() => onDynamicMedia(i)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute z-20 text-primary bottom-1 right-1">
                          <FaVideo className="" size={20} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Group Members*/}
        {currentChatingUser.type == "Group" && (
          <div className="border-b border-base-300 space-y-2 my-2">
            {currentChatingUser.admin == authUser._id && (
              <>
                <div
                  onClick={() =>
                    document.getElementById("addUsersDialog").showModal()
                  }
                  className="flex group relative items-center justify-between p-1 rounded-btn sm:hover:bg-primary/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className=" grid w-10 h-10 place-items-center rounded-full overflow-hidden bg-primary">
                      <IoMdPersonAdd
                        size={20}
                        className="text-primary-content"
                      />
                    </div>

                    <div className="flex flex-col gap-px">
                      <p className="font-semibold">Add Member</p>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() =>
                    document.getElementById("groupLinkModal").showModal()
                  }
                  className="flex group relative items-center justify-between p-1 rounded-btn sm:hover:bg-primary/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className=" grid w-10 h-10 place-items-center rounded-full overflow-hidden bg-primary">
                      <IoMdLink size={20} className="text-primary-content" />
                    </div>

                    <div className="flex flex-col gap-px">
                      <p className="font-semibold">Invite Via Link</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {currentChatingUser.members.map((item, idx) => {
              const isAdmin = currentChatingUser.admins.includes(item._id);
              return (
                <div
                  key={idx}
                  className="flex group relative items-center justify-between p-1 rounded-btn sm:hover:bg-primary/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-base-300 grid w-10 h-10 place-items-center rounded-full overflow-hidden">
                      <img
                        src={
                          item.profilePic ||
                          "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                        }
                        alt="user"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-px">
                      <p className="font-semibold">{item.fullname}</p>
                      <p className="text-sm">{item.phone || "..."}</p>
                    </div>
                    {isAdmin && (
                      <div className="absolute group-hover:bg-transparent z-0 group-hover:text-primary-content right-1 top-1 text-[10px] bg-base-100 text-primary">
                        <span className="bg-primary/20 group-hover:bg-transparent py-1 px-1.5 rounded-[4px]">
                          Group Admin
                        </span>
                      </div>
                    )}

                    <div className="absolute right-2 top-4">
                      {currentChatingUser.admin == authUser._id &&
                        authUser._id != item._id && (
                          <div className="dropdown dropdown-bottom  dropdown-end ">
                            <IoIosArrowDown
                              size={25}
                              role="button"
                              tabIndex={0}
                              className="group-focus-within:block group-hover:block hidden"
                            />
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu text-sm bg-base-100 border w-44 rounded-xl z-30 p-2 shadow-lg gap-1"
                            >
                              {isAdmin && (
                                <li>
                                  <button
                                    onClick={() =>
                                      removeAdmin(
                                        currentChatingUser._id,
                                        item._id
                                      )
                                    }
                                  >
                                    Dismiss As Admin
                                  </button>
                                </li>
                              )}
                              {!isAdmin && (
                                <li>
                                  <button
                                    onClick={() =>
                                      assignAdmin(
                                        currentChatingUser._id,
                                        item._id
                                      )
                                    }
                                  >
                                    Make Group Admin
                                  </button>
                                </li>
                              )}
                              <li>
                                <button
                                  onClick={() =>
                                    removeMember(
                                      currentChatingUser._id,
                                      item._id
                                    )
                                  }
                                >
                                  Remove
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Actions */}
        <div className="p-4 space-y-4">
          <ActionMenu
            icon={<MdOutlineFileDownload />}
            onClick={handleExport}
            label={"Export Chat"}
          />

          <ActionMenu
            icon={<LuTrash2 />}
            label={"Clear Chat"}
            onClick={() => clearChat(queryClient)}
          />
          {currentChatingUser.type == "Group" &&
          currentChatingUser.members.some(
            (user) => user._id == authUser._id
          ) ? (
            <button
              onClick={() => leaveGroup(currentChatingUser._id)}
              className="flex items-center gap-2 w-full  text-error font-semibold"
            >
              <RxExit size={20} />
              <span>Leave Group</span>
            </button>
          ) : (
            <button
              onClick={() => RemoveGroupFromChat(currentChatingUser._id)}
              className="flex items-center gap-2 w-full  text-error font-semibold"
            >
              <MdDelete size={20} />
              <span>Exit</span>
            </button>
          )}
          {currentChatingUser.type == "Group" &&
            currentChatingUser.admin == authUser._id &&
            currentChatingUser.members.length == 1 && (
              <button
                onClick={() => deleteGroup()}
                className="flex items-center gap-2 w-full  text-error font-semibold"
              >
                <FiTrash2 size={20} />
                <span>Delete Group</span>
              </button>
            )}
        </div>
      </div>
      <AddUserGroup
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        members={currentChatingUser.members}
        onDone={() => {
          addMember(currentChatingUser._id, selectedUsers);
          setSelectedUsers([]);
          document.getElementById("addUsersDialog").close();
        }}
      />
      <ProfilePreview img={newImg} id={currentChatingUser._id} />
      {currentChatingUser.type == "Group" && <GroupLink />}
    </>
  );
};

const ActionMenu = ({ icon, label, onClick }) => {
  return (
    <button onClick={onClick} className="flex items-center gap-2 w-full ">
      {icon}
      <span>{label}</span>
    </button>
  );
};

const AddUserGroup = ({ selectedUsers, setSelectedUsers, onDone, members }) => {
  const { getContactsList, contacts } = useContactList();
  const { searchQuery, filteredData, handleSearchChange } = useSearch(contacts);

  useEffect(() => {
    if (contacts.length === 0) {
      getContactsList();
    }
  }, [contacts, getContactsList]);

  const handleUserClick = (userId, userFullname, phone) => {
    if (selectedUsers.some((user) => user._id === userId)) {
      setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
    } else {
      setSelectedUsers([
        ...selectedUsers,
        { _id: userId, fullname: userFullname, phone },
      ]);
    }
  };

  const hanldeOnSumbit = () => {
    if (selectedUsers.length) {
      onDone();
    } else {
      toast.error("Please Select User");
    }
  };
  return (
    <dialog id="addUsersDialog" className="modal">
      <div className="modal-box w-[90%] h-full sm:h-[75%] flex p-5 bg-base-300 flex-col">
        {/* header */}
        <div className="flex justify-between gap-2 items-center ">
          <h3 className="font-bold text-lg">Add users to group</h3>
          <RxCross2
            size={18}
            className="cursor-pointer"
            onClick={() => document.getElementById("addUsersDialog").close()}
          />
        </div>
        {/* search bar */}
        <div className="relative my-2">
          <IoMdSearch size={20} className="absolute inset-y-0 h-full left-4" />
          <input
            type="search"
            className="input w-full input-bordered pl-12"
            placeholder="Search name or phone number"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {/* user list */}
        <div className="overflow-y-auto mb-11 space-y-0.5">
          {filteredData.length === 0 ? (
            <p className="text-center inset-x-0 inset-y-1/2 absolute">
              No contacts found
            </p>
          ) : (
            filteredData.map((contact, idx) => (
              <button
                key={idx}
                disabled={
                  members?.find((user) => user._id === contact._id) || false
                }
                onClick={() =>
                  handleUserClick(contact._id, contact.fullname, contact.phone)
                }
                className="flex items-center border border-base-100  disabled:bg-primary/50 disabled:hover:bg-primary/50 disabled:cursor-not-allowed w-full justify-between cursor-pointer sm:hover:bg-primary/5 sm:rounded-lg p-1 sm:p-2 pr-4"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-base-300 grid w-12 h-12 place-items-center rounded-full overflow-hidden">
                    <img
                      src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                      alt="user"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-px">
                    <p className="font-semibold">{contact.fullname}</p>
                    <p className="text-sm">bio</p>
                  </div>
                </div>
                {members?.find((user) => user._id === contact._id) ? (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary text-primary-content"
                    checked
                    disabled
                    readOnly
                  />
                ) : (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary text-primary-content"
                    disabled={
                      members?.find((user) => user._id === contact._id) || false
                    }
                    checked={selectedUsers.some(
                      (user) => user._id === contact._id
                    )}
                    readOnly
                  />
                )}
              </button>
            ))
          )}
        </div>
        <div className="w-full p-4 pb-3  absolute bottom-0 left-0">
          <button
            className="btn w-full btn-primary disabled:btn-primary/20 "
            disabled={!selectedUsers.length}
            onClick={hanldeOnSumbit}
          >
            Done
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button></button>
      </form>
    </dialog>
  );
};

const ProfilePreview = ({ img, id }) => {
  const {
    messagerUser,
    setMessagerUser,
    currentChatingUser,
    setCurrentChatingUser,
  } = useMessageStore();
  const [isLoading, setIsLoading] = useState(false);

  const upload = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("photo", img); // `img` should be a File object

    let res = await axiosInstance.put(`/group/updatePic/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    document.getElementById("Profile_preview_modal").close();
    if (res.data.success) {
      let update = messagerUser.map((item) => {
        if (item._id == id) {
          return { ...item, profilePic: res.data.photo }; // Fixing state update
        }
        return item;
      });
      currentChatingUser.profilePic = res.data.photo;
      setCurrentChatingUser(currentChatingUser);
      setMessagerUser(update);
      toast.success("Profile Pic Updated");
    } else {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };
  return (
    <dialog id="Profile_preview_modal" className="modal">
      <div className="modal-box bg-base-300 flex-col p-2">
        {/* header */}
        <div className="flex justify-between items-center ">
          <h3 className="font-bold text-lg">Profile Preview</h3>
          <RxCross2
            size={25}
            className="cursor-pointer"
            onClick={() =>
              document.getElementById("Profile_preview_modal").close()
            }
          />
        </div>
        <div className="flex justify-center items-center">
          <img src={img} className="object-cover w-60 h-60 rounded-xl" />
        </div>
        <div className="flex items-center justify-center mt-2 gap-2">
          <button
            disabled={isLoading}
            className="btn btn-success disabled:cursor-no-drop"
            onClick={upload}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-x-2">
                <span className="loading loading-spinner"></span> Uploading
              </div>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button></button>
      </form>
    </dialog>
  );
};
export default Profile;
