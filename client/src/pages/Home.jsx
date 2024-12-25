import React, { useState } from "react";
import ChatPage from "./ChatPage";
import NochatSelect from "../components/NochatSelect";
import SideSetting from "../components/SideSetting";
import Sidebar from "../components/Sidebar";
import Status from "./Status";
import Call from "./Calls";
import Setting from "./Setting";
import Myprofile from "./Myprofile";
import BottomBar from "../components/BottomBar";

const Home = () => {
  const userselected = false;
  const [activePage, setActivePage] = useState("chat");
  return (
    <div className="h-screen w-screen overflow-hidden flex gap-0 transition-all duration-200">
      {/* user setting */}
      <div className="w-[5rem] hidden sm:block bg-primary-content">
        <SideSetting setActivePage={setActivePage} activePage={activePage} />
      </div>
      {/* Contact List */}
      <div className="w-full sm:w-[50%] relative bg-primary/25 overflow-hidden">
        {activePage === "chat" && <Sidebar />}
        {activePage === "status" && <Status />}
        {activePage === "call" && <Call />}
        {activePage === "settings" && (
          <Setting setActivePage={setActivePage} activePage={activePage} />
        )}
        {activePage === "myprofile" && <Myprofile />}
        <div className="absolute flex items-center sm:hidden w-full z-50 bottom-0 rounded-t-box bg-primary-content h-20">
          <BottomBar activePage={activePage} setActivePage={setActivePage} />
        </div>
      </div>

      {/* Message Area */}
      <div className="hidden sm:block w-[60%]  bg-primary-content">
        {userselected ? <ChatPage /> : <NochatSelect />}
      </div>

      <div className="flex items-center sm:hidden w-full z-50 bottom-0 rounded-t-box bg-primary-content h-20 fixed">
        <BottomBar activePage={activePage} setActivePage={setActivePage} />
      </div>
    </div>
  );
};

export default Home;
