import React, { useState } from "react";
import ChatPage from "./ChatPage";
import Sidebar from "../components/Sidebar";
import NochatSelect from "../components/NochatSelect";
import SideSetting from "../components/SideSetting";

const Home = () => {
  const [userselected, setuserselect] = useState(false);
  return (
    <div className="h-screen w-screen flex gap-0 transition-all duration-200">
      {/* user setting */}
      <div className="w-[5rem] hidden sm:block">
        <SideSetting />
      </div>
      {/* Contact List */}
      <div className="w-full sm:w-[50%] overflow-hidden">
        <Sidebar />
      </div>

      {/* Message Area */}
      <div className="hidden sm:block w-[60%]  bg-accent-content">
        {userselected ? <ChatPage /> : <NochatSelect />}
      </div>
    </div>
  );
};

export default Home;
