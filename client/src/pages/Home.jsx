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
import { useQueryClient } from "@tanstack/react-query";
import useGroupStore from "../store/useGroupStore";

const Home = () => {
  const { currentChatingUser, handleNewMessage, handleMessageReaction } =
    useMessageStore();
  const queryClient = useQueryClient();
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
  const {
    handleNewMember,
    handleNewGroup,
    handleNewAdmin,
    handleremoveMember,
    handleLeaveGroup,handleRemoveAdmin,hanldeDeleteGroup
  } = useGroupStore();

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
      console.log("Setting up socket listeners for Home page");
      const callofferHanlder = (data) => {
        console.log(
          "Incoming call offer from:",
          data.from,
          "calltype : ",
          data.callType
        );
        incomingCallAnswere(data.from, data.callType);
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
      socket.on("newMessage", (data) => handleNewMessage(data, queryClient));
      socket.on("seenStatus", hanldeSeenStatus);
      socket.on("refreshStatus", hanldeRefreshStatus);
      socket.on("message_reaction", (id, reaction) =>
        handleMessageReaction(id, reaction, queryClient)
      );
      socket.on("deleteStatus", handleDeleteStatus);
      socket.on("newGroup", handleNewGroup);
      socket.on("newMember", handleNewMember);
      socket.on("newAdmin", handleNewAdmin);
      socket.on("removeMember", handleremoveMember);
      socket.on("leaveGroup", handleLeaveGroup);
      socket.on("removeAdmin",handleRemoveAdmin)
      socket.on("deleteGroup",hanldeDeleteGroup)
      return () => {
        socket.off("newStatus");
        socket.off("refreshStatus");
        socket.off("seenStatus");
        socket.off("callEnded");
        socket.off("callOffer");
        socket.off("newMessage");
        socket.off("deleteStatus");
        socket.off("message_reaction");
        socket.off("newGroup");
        socket.off("newMember");
        socket.off("newAdmin");
        socket.off("removeMember");
        socket.off("leaveGroup");
        socket.off("removeAdmin");
        socket.off("deleteGroup")
      };
    }
  }, [
    socket,
    handleUserStatus,
    handleNewMessage,
    hanldeSeenStatus,
    hanldeRefreshStatus,
    handleDeleteStatus,
    currentChatingUser,
    handleMessageReaction,
    handleNewAdmin,
    handleNewGroup,
    handleNewMember,
    handleremoveMember,
    handleRemoveAdmin,hanldeDeleteGroup
  ]);

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
