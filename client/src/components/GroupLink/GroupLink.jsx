import { useState, useEffect } from "react";
import { FiShare2, FiCopy, FiRefreshCw, FiSquare } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineQrCode } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoClose, IoSend } from "react-icons/io5";
import Qrcode from "./Qrcode";
import toast, { Toaster } from "react-hot-toast";
import useMessageStore from "../../store/useMessageStore";
import useAuthStore from "../../store/useAuthStore";
import { BsCheckSquare } from "react-icons/bs";

const GroupLink = ({ img, name, inviteLink }) => {
  const [groupLink] = useState(`https://BaatCheet.com/${inviteLink}`);
  const [copied, setCopied] = useState(false);
  const { authUser } = useAuthStore();
  const { currentChatingUser, sendMessage } = useMessageStore();
  const [animationDelay, setAnimationDelay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationDelay(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(groupLink);
    setCopied(true);
    toast.success("Copied..");
    setTimeout(() => setCopied(false), 2000);
  };

  const sendData = (receiver) => {
    const { profilePic, fullname } = authUser;
    let link = `${import.meta.env.VITE_CLIENT_HOST}/${
      currentChatingUser.inviteLink
    }`;

    receiver.forEach((_) => {
      sendMessage(
        currentChatingUser,
        {
          type: "link",
          data: link,
        },
        {
          profilePic,
          fullname,
        }
      );
    });

    document.getElementById("Share_Link").close();
    document.getElementById("groupLinkModal").close();
  };

  return (
    <>
      <dialog id="groupLinkModal" className="modal z-20">
        <Toaster />
        <div className="modal-box p-0 rounded-xl text-primary-content">
          <div className=" flex items-center p-4 bg-primary shadow-lg relative">
            <h1 className="text-xl font-medium ml-3">Group link</h1>
            <button
              onClick={() => document.getElementById("groupLinkModal").close()}
              className="btn btn-primary border-none shadow-none absolute right-2"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-8 bg-base-100 text-base-content">
            <div
              className={`space-y-8 ${
                !animationDelay ? "animate-slide-up" : "opacity-0"
              }`}
            >
              {/* Group Info */}
              <div className="flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm">
                <img
                  src={
                    img ||
                    "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                  }
                  className="h-14 w-14 avatar rounded-full "
                />

                <div className="flex-1">
                  <h2 className=" font-medium text-lg mb-1 ">{name}</h2>
                  <Link className="text-sm font-medium text-info-content">
                    {groupLink}
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2  flex flex-col">
                <button
                  onClick={() =>
                    document.getElementById("Share_Link").showModal()
                  }
                  className="btn"
                >
                  <FaWhatsapp className="h-5 w-5 " />

                  <span className="font-medium">Send link via BaatCheet</span>
                </button>

                <button className="btn" onClick={handleCopy}>
                  <FiCopy className="h-5 w-5 " />

                  <span className="font-medium">
                    {copied ? "Copied!" : "Copy link"}
                  </span>
                </button>

                <button className="btn">
                  <FiShare2 className="h-5 w-5 " />

                  <span className="font-medium">Share link</span>
                </button>

                <button
                  className="btn"
                  onClick={() =>
                    document.getElementById("QrCode_Modal").showModal()
                  }
                >
                  <MdOutlineQrCode className="h-5 w-5 " />

                  <span className="font-medium">QR code</span>
                </button>

                <button className="btn btn-error">
                  <FiRefreshCw className="h-5 w-5" />

                  <span className="font-medium ">Reset link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
      <Qrcode name={name} img={img} inviteLink={inviteLink} />

      <Share sendData={sendData} />
    </>
  );
};

const Share = ({ sendData }) => {
  
  const { friends } = useAuthStore();
  const [selectedUser, setSelectedUser] = useState([]);

  const toggleChat = (id, name) => {
    let check = selectedUser.filter((item) => item.id == id);

    if (check.length) {
      setSelectedUser((prev) => prev.filter((item) => item.id !== id));
    } else {
      setSelectedUser((prev) => [...prev, { id, name }]);
    }
  };

  return (
    <dialog
      id="Share_Link"
      className="modal w-full h-full absolute top-0 left-0 z-20 bg-transparent text-base-content"
    >
      <div className="modal-box w-[90%] md:w-[40%] md:h-fit border border-base-300 p-0 bg-base-100">
        {/* Header */}
        <div className="bg-primary text-primary-content p-3 flex items-center justify-between ">
          <h1 className="text-lg font-medium">Forward message to</h1>

          {/* if there is a button in form, it will close the modal */}
          <button
            onClick={() => {
              document.getElementById("Share_Link").close();
            }}
            className="btn btn-sm text-lg btn-circle btn-ghost absolute right-4 top-3"
          >
            ✕
          </button>
        </div>

        {/* Recent Chats Section */}
        <div className="p-2 max-h-[70vh] overflow-y-auto">
          <h2 className="text-primary font-medium mb-4">RECENT CHATS</h2>

          <div className="space-y-2 h-full ">
            {friends.map((user, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => toggleChat(user.userId, user.savedName)}
              >
                <div className="flex-shrink-0">
                  {selectedUser.filter((item) => item.id == user.userId)
                    .length ? (
                    <BsCheckSquare className="text-primary" size={20} />
                  ) : (
                    <FiSquare className="" size={20} />
                  )}
                </div>

                <div className="indicator relative ">
                  <span className="indicator-item rounded-full absolute w-3 h-3 p-0 top-2 right-2"></span>
                  <div className="bg-base-300 grid w-12 h-12 place-items-center rounded-full overflow-hidden">
                    <img
                      src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                      alt="user"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium truncate">
                    {user.savedName}
                  </p>
                  <p className="text-sm truncate">{user.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*Receiver Names */}
        <div className="border-t border-base-300 ">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="flex-1">
              <p className="text-sm t">
                {selectedUser.map((item) => {
                  if (selectedUser.length == 1) return item.name;

                  return `${item.name},`;
                })}
              </p>
            </div>
            {selectedUser.length > 0 && (
              <button
                onClick={() => sendData(selectedUser)}
                className="bg-primary p-3 rounded-full"
              >
                <IoSend size={25} />
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default GroupLink;
