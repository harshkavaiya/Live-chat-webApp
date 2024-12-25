import { BsFileText, BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { LuTrash2 } from "react-icons/lu";
import { BiDownload } from "react-icons/bi";
import Poll from "../Poll/Poll";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const ChatMessage = ({ isSelectMessage, setIsSelectMessage }) => {
  const [messages] = useState([
    {
      id: 1,
      sender: "12",
      receiver: "123",
      type: "text",
      data: "Hi I am Josephin, can you help me to find best chat app?",
      read: false,
      timestamp: "01:40 AM",
    },
    {
      id: 2,
      sender: "12",
      receiver: "123",
      type: "image",
      data: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmCy16nhIbV3pI1qLYHMJKwbH2458oiC9EmA&s",
      read: false,
      timestamp: "03:40 AM",
    },
    {
      id: 3,
      sender: "12",
      receiver: "123",
      type: "file",
      data: {
        link: "file://C:/Users/Hardik/Downloads/profile-page.tsx.txt",
        size: 10000,
        name: "Reactjs.txt",
      },
      read: false,
      timestamp: "01:40 AM",
    },
    {
      id: 4,
      sender: "12",
      receiver: "123",
      type: "poll",
      data: {
        question: "What is Most Popular Laguanage?",
        options: [
          { text: "Python", vote: 2 },
          { text: "Java", vote: 0 },
          { text: "JavaScript", vote: 4 },
          { text: "C++", vote: 0 },
        ],
        votes: 0,
      },
      read: false,
      timestamp: "01:40 AM",
    },
    {
      id: 5,
      sender: "123",
      receiver: "12",
      type: "location",
      data: { latitude: 23.0225, longitude: 72.5714 },
      read: false,
      timestamp: "01:40 AM",
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

  const CloseSelectMessage = () => {
    setSelectMessage([]);
    setIsSelectMessage(false);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-1 space-y-1 bg-base-100">
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
                message.sender == "12" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble rounded-xl  max-w-[80%] px-2 py-1 ${
                  message.sender == "12"
                    ? "bg-primary text-primary-content"
                    : "bg-base-300 text-base-content"
                }`}
              >
                {message.type == "text" && (
                  <p className="text-sm">{message.data}</p>
                )}
                {message.type == "image" && (
                  <img
                    src={message.data}
                    alt="image"
                    className="w-72 h-52 rounded-xl py-1"
                  />
                )}
                {message.type == "file" && (
                  <>
                    <div
                      className={`flex items-start gap-2 ${
                        message.sender == "12"
                          ? "bg-base-100/25 text-primary-content "
                          : "bg-base-100 text-base-content"
                      } p-1 rounded-lg w-[55vw]  md:w-60`}
                    >
                      {/* File Icon */}
                      <div className=" p-2 rounded-lg">
                        <BsFileText className="text-2xl " />
                      </div>

                      {/* File Info */}
                      <div className="flex-1">
                        <div className="font-medium text-sm truncate">
                          {message.data.name}
                        </div>
                        <div className="text-xs ">{message.data.size}</div>
                      </div>

                      {/* Download Icon */}
                      <button className="btn btn-ghost btn-circle btn-sm">
                        <BiDownload className="text-xl " />
                      </button>
                    </div>
                  </>
                )}
                {message.type == "poll" && <Poll data={message.data} />}
                {message.type == "location" && (
                  <div className="w-[66vw] md:w-72 h-56 z-0 p-2">
                    <MapContainer
                      center={[message.data.latitude, message.data.longitude]}
                      zoom={15}
                      className="w-full h-full -z-0 rounded-md"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <Marker
                        position={[
                          message.data.latitude,
                          message.data.longitude,
                        ]}
                      />
                    </MapContainer>
                  </div>
                )}
                <p
                  className={`mt-0.5 text-[10px] text-end flex items-end justify-end gap-1${
                    message.sender == "12"
                      ? "text-primary-content/70"
                      : "text-base-content/70"
                  }`}
                >
                  12:00 PM
                  {message.sender == "12" && (
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
        <div className="absolute w-full h-[70px] bg-base-300 left-0 bottom-0 z-50 flex items-center text-base-content overflow-hidden">
          <IoClose onClick={CloseSelectMessage} size={30} className="ml-4" />
          <p className="flex gap-x-2 items-center text-xl">
            <span className="">{selectMessage.length}</span> Selected
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
