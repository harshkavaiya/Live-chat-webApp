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
  const { handleSelectMessage, sendSelectionMessage, setSelectMessage } =
    useFunctionStore();
  const [selectedChats, setSelectedChats] = useState([]);

  const toggleChat = (id) => {
    setSelectedChats((prev) =>
      prev.includes(id) ? prev.filter((chatId) => chatId !== id) : [...prev, id]
    );
  };

  return (
    <dialog className="modal modal-open w-full h-full absolute top-0 left-0 z-20 bg-transparent text-base-content">
      <div className="modal-box w-[90%] md:w-[40%] md:h-fit border border-base-300 p-0 bg-base-100">
        {/* Header */}
        <div className="bg-primary text-primary-content p-3 flex items-center justify-between ">
          <h1 className="text-lg font-medium">Forward message to</h1>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => {
                handleSelectMessage(false), setSelectMessage([]);
              }}
              className="btn btn-sm text-lg btn-circle btn-ghost absolute right-4 top-3"
            >
              ✕
            </button>
          </form>
        </div>

        {/* Recent Chats Section */}
        <div className="p-2 max-h-[75vh] overflow-y-scroll">
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
                    <FiSquare className="" size={20} />
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
                  <p className="text-sm font-medium truncate">{chat.name}</p>
                  <p className="text-sm truncate">{chat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*Receiver Names */}
        <div className="border-t border-base-300 ">
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
    </dialog>
  );
};

export default Share;
