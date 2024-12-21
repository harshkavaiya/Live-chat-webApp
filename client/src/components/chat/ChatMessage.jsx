import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { LuTrash2 } from "react-icons/lu";

const ChatMessage = ({ isSelectMessage }) => {
  const [messages] = useState([
    {
      read: false,
      id: 1,
      sender: "Josephin",
      content: "Hi I am Josephin, can you help me to find best chat app?",
      timestamp: "01:40 AM",
    },
    {
      read: true,
      id: 2,
      sender: "Josephin",
      content: "it should from elite auther 😊",
      timestamp: "01:40 AM",
    },
    {
      read: false,
      id: 3,
      sender: "Alan josheph",
      content:
        "Sure, chitchat is best theme for chating project, you can it check here.",
      timestamp: "01:40 AM",
    },
    {
      read: false,
      id: 4,
      sender: "Josephin water",
      content: "I think it's best for my project.",
      timestamp: "01:42 AM",
    },
    {
      read: false,
      id: 5,
      sender: "Alan josheph",
      content: "If you have any other query then feel free to ask us.",
      timestamp: "01:45 AM",
    },
    {
      read: false,
      id: 6,
      sender: "Alan josheph",
      content: "If you have any other query then feel free to ask us.",
      timestamp: "01:45 AM",
    },
  ]);
  const [selectMessage, setSelectMessage] = useState([]);

  const handelSelectMessage = (data) => {
    if (selectMessage.length == 0) {
      setSelectMessage([data]);
    } else {
      selectMessage.forEach((element) => {
        console.log(element.id == data.id);
        if (element.id == data.id) {
          setSelectMessage(selectMessage.filter((msg) => msg.id != data.id));
        } else {
          setSelectMessage([...selectMessage, data]);
        }
      });
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto py-2 space-y-4 bg-base-100">
        {messages.map((message, i) => (
          <div key={i} className="flex w-full items-center">
            {isSelectMessage && (
              <input
                type="checkbox"
                onClick={() => handelSelectMessage(message)}
                className="checkbox ml-2 "
              />
            )}
            <div
              className={`chat w-full h ${
                message.sender == "Josephin" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble rounded-xl  w-[78%] px-3 py-1 ${
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
                                 text-[10px] mt-1.5 text-end flex items-end justify-end gap-1
                                 ${
                                   message.sender == "Josephin"
                                     ? "text-primary-content/70"
                                     : "text-base-content/70"
                                 }
                               `}
                >
                  12:00 PM{" "}
                  {message.sender == "Josephin" && (
                    <BsThreeDots
                      size={16}
                      className={`${
                        message.read ? "text-blue-500" : "text-base-100"
                      } `}
                    />
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isSelectMessage && (
        <div className="absolute w-full h-[70px] bg-base-300 bottom-0 z-20 flex items-center text-base-content">
          <IoClose size={30} className="ml-4" />
          <p className="flex gap-x-2 ml-3 items-center text-xl">
            <span>{selectMessage.length}</span> Selected
          </p>
          {selectMessage.length > 0 && (
            <div className="flex justify-end w-full mr-3 gap-x-2">
              <IoIosShareAlt size={30} className="" />
              <LuTrash2 size={30} className="" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatMessage;
