import { useEffect, useRef, useState } from "react";
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

const Home = () => {
  const { currentChatingUser } = useMessageStore();
  const { socket, authUser } = useAuthStore();
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
  const { createPeerId, incomingCallAnswere,setIncomming,endCall } = useVideoCall();
  const [open, setOpen] = useState(false);
  const [incomOpen, setIncomOpen] = useState(false);
  const { SetActivePage, activePage } = useHomePageNavi();

  const dialoghandler = (dilog) => {
    setOpen(dilog);
  };

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
      socket.on("callOffer", (data) => {
        setIncomOpen(true);
        dialoghandler(true);
        console.log(
          "Incoming call offer from:",
          data.from,
          "////// calltype : ",
          data.callType
        );
        incomingCallAnswere(data.from, data.callType);
      });
      socket.on("callEnded", (data) => {
        console.log("Call ended by:", data.from);
        setOpen(false);
        endCall();
        setIncomming(null);
        console.log("cleaning resources");
      });
      socket.on("newStatus", handleUserStatus);
      socket.on("seenStatus", hanldeSeenStatus);
      socket.on("refreshStatus", hanldeRefreshStatus);
      socket.on("deleteStatus", handleDeleteStatus);
      return () => {
        socket.off("newStatus");
        socket.off("refreshStatus");
        socket.off("seenStatus");
        socket.off("callEnded");
        socket.off("callOffer");
      };
    }
  }, []);

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

  return (
    <div className="h-screen w-screen overflow-hidden flex gap-0 transition-all duration-200">
      {/* incoming dialog */}
      {incomOpen && (
        <IncomingCallDialog dialoghandler={dialoghandler} open={open} />
      )}
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
          ${currentChatingUser && "hidden sm:block"} 
        `}
        >
          {renderActivePage()}
        </div>
      )}
      {/* Message Area */}
      <div
        className={`w-full sm:w-[65%] bg-base-100 ${
          currentChatingUser ? "block" : "hidden sm:block"
        }`}
      >
        {currentChatingUser ? <ChatPage /> : <NochatSelect />}
      </div>

      {!currentChatingUser && authUser && (
        <div className="flex items-center sm:hidden w-full z-4  0 bottom-0 bg-primary-content h-20 fixed">
          <BottomBar />
        </div>
      )}

      {status.length > 0 && <StatusPreview />}
      {isStatusPageOpen && <MyStatusPreview />}
    </div>
  );
};

export default Home;
