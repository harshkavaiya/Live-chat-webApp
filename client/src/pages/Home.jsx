import { useEffect, useRef } from "react";
import ChatPage from "./ChatPage";
import NochatSelect from "../components/NochatSelect";
import SideSetting from "../components/SideSetting";
import Sidebar from "../components/Sidebar";
import Status from "./Status";
import Call from "./Calls";
import Setting from "./Setting";
import Myprofile from "./Myprofile";
import BottomBar from "../components/BottomBar";
import useMessageStore from "../store/useMessageStore";
import useAuthStore from "../store/useAuthStore";
import IncomingCallDialog from "../components/PopUpDialog/IncomingCallDialog";
import useVideoCall from "../store/useVideoCall";
import useHomePageNavi from "../store/useHomePageNavi";
import useStatusStore from "../store/useStatusStore";
import StatusPreview from "../components/Status/StatusPreview";
import MyStatusPreview from "../components/Status/MyStatusPreview";
import CreatePoll from "../components/Poll/CreatePoll";
import toast from "react-hot-toast";

const Home = () => {
  const { currentChatingUser,notificationSound } = useMessageStore();
  const { socket, authUser, checkAuth } = useAuthStore();
  const {
    status,
    isStatusPageOpen,
    handleUserStatus,
    hanldeSeenStatus,
    findUserStatus,
    hanldeRefreshStatus,
    handleDeleteStatus,
  } = useStatusStore();

  const hasRegisteredPeerId = useRef(false);

  const { createPeerId, incomingCallAnswere, setIncomming, endCall } =
    useVideoCall();

  const { SetActivePage, activePage } = useHomePageNavi();

  useEffect(() => {
    if (authUser && socket && !hasRegisteredPeerId.current) {
      console.log("Registering Peer ID:", authUser._id);
      socket.emit("registerPeerId", authUser._id);
      createPeerId(authUser._id);
      hasRegisteredPeerId.current = true;
    }
  }, []);

  useEffect(() => {
    findUserStatus(authUser._id);
  }, []);

  useEffect(() => {
    // Handle incoming call offers
    if (socket) {
      const callofferHanlder = (data) => {
        incomingCallAnswere(data.from, data.callType);
        console.log(
          "Incoming call offer from:",
          data.from,
          "calltype : ",
          data.callType
        );
      };

      const endcallhandler = (data) => {
        console.log("Call ended by:", data.from);
        endCall();
        setIncomming(null);
        console.log("cleaning resources");
      };

      socket.on("callOffer", callofferHanlder);
      socket.on("callEnded", endcallhandler);
      socket.on("newStatus", handleUserStatus);
      socket.on("newMessage", (data)=>{
        const { newMessage, name, profilePic } = data;
        const {type,data:message}=newMessage
        if (currentChatingUser && currentChatingUser._id == newMessage.sender)
          return;
        notificationSound();
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      profilePic ||
                      "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                    }
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {type == "text"&& <span className="truncate">{message}</span>}
                    {type=="location" &&<span>Location</span>}
                    {type=="poll" &&<span>Poll</span>}
                    {type=="image" &&<span>Image</span>}
                    {type=="video" &&<span>Video</span>}
                    {type=="audio" &&<span>Audio</span>}
                    {type=="multiple-file" &&<span>Multiple File</span>}
                    {type=="file" &&<span>File</span>}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ));
      });
      socket.on("seenStatus", hanldeSeenStatus);
      socket.on("refreshStatus", hanldeRefreshStatus);
      socket.on("deleteStatus", handleDeleteStatus);
      return () => {
        socket.off("newStatus");
        socket.off("refreshStatus");
        socket.off("seenStatus");
        socket.off("callEnded");
        socket.off("callOffer");
        socket.off("newMessage");
        socket.off("deleteStatus");
      };
    }
  }, [socket]);

  // useEffect(() => {
  //   console.log("Home: incomingCall updated =>", incomingCall);

  //   if (incomingCall) {
  //     setTimeout(() => {
  //       const dialog = document.getElementById("incomingDialog");
  //       if (dialog) {
  //         dialog.showModal();
  //       } else {
  //         console.error("Dialog element not found!");
  //       }
  //     }, 100); // Small delay to ensure re-render
  //   }
  // }, [incomingCall]);

  const renderActivePage = () => {
    switch (activePage) {
      case "chat":
        return <Sidebar />;
      case "status":
        return <Status />;
      case "call":
        return <Call />;
      case "settings":
        return <Setting />;
      case "myprofile":
        return <Myprofile />;
      default:
        return <Sidebar />;
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex gap-0 transition-all duration-200">
      {/* incoming dialog */}
      <IncomingCallDialog />
      {/* user setting */}
      <div className="w-[4rem] hidden sm:block bg-primary-content">
        <SideSetting />
      </div>
      {/* Contact List */}
      {authUser && (
        <div
          className={`
          w-full sm:w-[35%] 
          relative 
          bg-primary/25 
          overflow-hidden
          ${currentChatingUser._id && "hidden sm:block"} 
        `}
        >
          {renderActivePage()}
        </div>
      )}
      {/* Message Area */}
      <div
        className={`w-full sm:w-[65%] bg-base-100 ${
          currentChatingUser._id ? "block" : "hidden sm:block"
        }`}
      >
        {currentChatingUser._id ? <ChatPage /> : <NochatSelect />}
      </div>

      {!currentChatingUser._id && authUser && (
        <div className="flex items-center sm:hidden w-full z-4  0 bottom-0 bg-primary-content h-20 fixed">
          <BottomBar />
        </div>
      )}

      {status.length > 0 && <StatusPreview />}
      {isStatusPageOpen && <MyStatusPreview />}

      <CreatePoll />
    </div>
  );
};

export default Home;
