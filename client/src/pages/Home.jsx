import React, { useState } from "react";
import ChatPage from "./ChatPage";
import Sidebar from "../components/Sidebar";
import NochatSelect from "../components/NochatSelect";
import SideSetting from "../components/SideSetting";

const Home = () => {
  const [userselected, setuserselect] = useState(false);
  return (
    <div className="h-screen w-screen flex">
      {/* user setting */}
      <div className="w-[5%]">
        <SideSetting />
      </div>
      {/* Contact List */}
      <div className="sm:w-[40%] w-full overflow-hidden">
        <Sidebar />
      </div>

      {/* Message Area */}
      <div className="sm:block flex-1 hidden bg-accent-content">
        {userselected ? <ChatPage /> : <NochatSelect />}
      </div>
    </div>
  );
};

export default Home;
