import React, { useEffect, useRef, useState } from "react";
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

const Home = () => {
  const [activePage, setActivePage] = useState("chat");
  const { currentChatingUser } = useMessageStore();
  const { incomingCall } = useVideoCall();
  const { socket, authUser } = useAuthStore();
  const hasRegisteredPeerId = useRef(false);
  const { createPeerId, peer, incomingCallAnswere } = useVideoCall();

  useEffect(() => {
    if (authUser && socket && !hasRegisteredPeerId.current) {
      console.log("Registering Peer ID:", authUser._id);
      // console.log("Has Registered Peer ID:", hasRegisteredPeerId.current);
      socket.emit("registerPeerId", authUser._id);
      createPeerId(authUser._id);
      hasRegisteredPeerId.current = true;
      // console.log("Has Registered aftre", hasRegisteredPeerId.current);
    }
  }, [peer]);

  useEffect(() => {
    // Handle incoming call offers
    if (socket) {
      socket.on("callOffer", (data) => {
        console.log("Incoming call offer from:", data.from);
        incomingCallAnswere(data.from);
        document.getElementById("incomingDialog").showModal();
      });
    }
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex gap-0 transition-all duration-200">
      {/* incoming dialog */}
      <IncomingCallDialog />
      {/* user setting */}
      <div className="w-[5rem] hidden sm:block bg-primary-content">
        <SideSetting setActivePage={setActivePage} activePage={activePage} />
      </div>
      {/* Contact List */}
      <div
        className={`${
          currentChatingUser && "hidden sm:block"
        } w-full sm:w-[50%] relative bg-primary/25 overflow-hidden`}
      >
        {activePage === "chat" && <Sidebar />}
        {activePage === "status" && <Status />}
        {activePage === "call" && <Call />}
        {activePage === "settings" && (
          <Setting setActivePage={setActivePage} activePage={activePage} />
        )}
        {activePage === "myprofile" && <Myprofile />}
      </div>

      {/* Message Area */}
      <div
        className={` ${
          !currentChatingUser && "hidden"
        } sm:block w-[100%]  bg-base-100`}
      >
        {currentChatingUser ? <ChatPage /> : <NochatSelect />}
      </div>

      {!currentChatingUser && (
        <div className="flex items-center sm:hidden w-full z-50 bottom-0 rounded-t-box bg-primary-content h-20 fixed">
          <BottomBar activePage={activePage} setActivePage={setActivePage} />
        </div>
      )}
    </div>
  );
};

export default Home;
