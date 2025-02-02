import { IoClose, IoSend } from "react-icons/io5";
import { BsCheckSquare } from "react-icons/bs";
import { FiSquare } from "react-icons/fi";
import { useState } from "react";
import useFunctionStore from "../../store/useFuncationStore";

const Share = () => {
  const recentChats = [
    {
      id: 1,
      name: "BHAI 🥰 (You)",
      description: "Message yourself",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Harsh College Friend",
      description: "At BCA college",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "ખુશાલ Brother👆",
      description: "💝 😊 HAPPY 😊 💝",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "22",
      description: "life is never easy but always good thinking...",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "BHAI 🥰 (You)1",
      description: "Message yourself",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Harsh College Friend 1",
      description: "At BCA college",
      image: "/placeholder.svg?height=40&width=40",
    },
  ];
  const { handleSelectMessage, sendSelectionMessage } = useFunctionStore();
  const [selectedChats, setSelectedChats] = useState([]);

  const toggleChat = (id) => {
    setSelectedChats((prev) =>
      prev.includes(id) ? prev.filter((chatId) => chatId !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full mx-auto absolute z-10 overflow-hidden top-0 h-full flex items-center justify-center left-0">
      <div className="w-[90%] md:w-[40%] md:h-fit text-primary-content bg-base-100 border border-base-300 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-content p-3 flex items-center justify-between ">
          <h1 className="text-lg font-medium">Forward message to</h1>
          <button onClick={() => handleSelectMessage(false)} className="p-1">
            <IoClose size={24} />
          </button>
        </div>

        {/* Recent Chats Section */}
        <div className="p-4 max-h-[75vh] overflow-y-scroll">
          <h2 className="text-primary font-medium mb-4">RECENT CHATS</h2>

          <div className="space-y-2 h-full ">
            {recentChats.map((chat, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => toggleChat(chat.id)}
              >
                <div className="flex-shrink-0">
                  {selectedChats.includes(chat.id) ? (
                    <BsCheckSquare className="text-primary" size={20} />
                  ) : (
                    <FiSquare className="text-primary-content" size={20} />
                  )}
                </div>

                <div className="indicator relative ">
                  <span className="indicator-item rounded-full absolute w-3 h-3 p-0 top-2 right-2"></span>
                  <div className="bg-base-300 grid w-12 h-12 place-items-center rounded-full overflow-hidden">
                    <img
                      src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                      alt="user"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-content truncate">
                    {chat.name}
                  </p>
                  <p className="text-sm text-primary-content/70 truncate">
                    {chat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*Receiver Names */}
        <div className="border-t border-base-300 bg-base-100  text-primary-content ">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="flex-1">
              <p className="text-sm t">
                {selectedChats.map((item, i) => {
                  if (selectedChats.length - 1 == i) {
                    return item;
                  } else {
                    return `${item},`;
                  }
                })}
              </p>
            </div>
            {selectedChats.length > 0 && (
              <button
                onClick={sendSelectionMessage}
                className="bg-primary p-3 rounded-full"
              >
                <IoSend size={25} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
