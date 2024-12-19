import { FaPhoneAlt, FaRegSmile } from "react-icons/fa";
import { IoVideocam, IoEllipsisVerticalSharp, IoSend } from "react-icons/io5";
import { BsGrid } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { FaMicrophone } from "react-icons/fa6";
import { useState } from "react";

const ChatPage = () => {
  const [messages] = useState([
    {
      id: 1,
      sender: "Josephin",
      content: "Hi I am Josephin, can you help me to find best chat app?",
      timestamp: "01:40 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      sender: "Josephin",
      content: "it should from elite auther 😊",
      timestamp: "01:40 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      sender: "Alan josheph",
      content:
        "Sure, chitchat is best theme for chating project, you can it check here.",
      timestamp: "01:40 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      sender: "Josephin water",
      content: "I think it's best for my project.",
      timestamp: "01:42 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      sender: "Alan josheph",
      content: "If you have any other query then feel free to ask us.",
      timestamp: "01:45 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]);
  return (
    <div data-theme="business" className="flex flex-col h-screen bg-base-100">
      {/* Header */}
      <div className="flex items-center justify-between p-3 shadow border-b">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
              J
            </div>
            <p className="ml-4 font-semibold text-3xl">Hardik</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <FaPhoneAlt className="h-5 w-5" />
          <IoVideocam className="h-5 w-5" />
          <BsGrid className="h-5 w-5" />
          <IoEllipsisVerticalSharp className="h-5 w-5" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`chat ${
              message.sender == "Josephin" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div
              className={`chat-bubble rounded-xl w-[78%] px-3 py-1 ${
                message.sender == "Josephin"
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content"
              }`}
            >
              <p className="text-sm">
                It was said that you would, destroy the Sith, not join them.
              </p>
              <p
                className={`
                                 text-[10px] mt-1.5
                                 ${
                                   message.sender == "Josephin"
                                     ? "text-primary-content/70"
                                     : "text-base-content/70"
                                 }
                               `}
              >
                12:00 PM
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-2  border-t  bg-base-100">
        <div className="flex items-center gap-2">
          <FaRegSmile className="h-5 w-5" />
          <GoPlus className="h-5 w-5" />
          <input
            className="input input-bordered flex-1 text-sm h-10"
            placeholder="Write your message..."
            type="text"
          />

          <FaMicrophone className="h-5 w-5" />

          <IoSend className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
