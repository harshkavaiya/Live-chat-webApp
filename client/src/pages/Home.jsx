import React, { useState } from "react";
import ChatPage from "./ChatPage";
import NochatSelect from "../components/NochatSelect";
import SideSetting from "../components/SideSetting";
import Sidebar from "../components/Sidebar";
import Status from "./Status";
import Call from "./Calls";
import Setting from "./Setting";
import Myprofile from "./Myprofile";

const Home = () => {
  const [userselected, setuserselect] = useState(false);
  const [activePage, setActivePage] = useState("chat");
  return (
    <div className="h-screen w-screen flex gap-0 transition-all duration-200">
      {/* user setting */}
      <div className="w-[5rem] hidden sm:block bg-primary-content">
        <SideSetting setActivePage={setActivePage} activePage={activePage} />
      </div>
      {/* Contact List */}
      <div className="w-full sm:w-[50%] overflow-hidden">
        {activePage === "chat" && <Sidebar />}
        {activePage === "status" && <Status />}
        {activePage === "call" && <Call />}
        {activePage === "settings" && <Setting />}
        {activePage === "myprofile" && <Myprofile />}
      </div>

      {/* Message Area */}
      <div className="hidden sm:block w-[60%]  bg-primary-content">
        {userselected ? <ChatPage /> : <NochatSelect />}
      </div>
    </div>
  );
};

export default Home;
