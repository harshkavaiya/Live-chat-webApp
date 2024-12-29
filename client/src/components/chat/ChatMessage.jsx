import { BsFileText, BsThreeDots } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { LuTrash2 } from "react-icons/lu";
import { BiDownload } from "react-icons/bi";
import Poll from "../Poll/Poll";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import useMessageStore from "../../store/useMessageStore";
import useAuthStore from "../../store/useAuthStore";
import { formatMessageTime } from "../../function/TimeFormating";
import MessageLoadingSkeleton from "../Skeleton/MessageLoginSkeleton";
import useFunctionStore from "../../store/useFuncationStore";

const ChatMessage = () => {
  const {
    messages,
    suscribeToMessage,
    unsuscribeFromMessage,
    getMessage,
    isMessageLoading,
    currentChatingUser,
  } = useMessageStore();
  const { onSelectMessage, selectMessage, isSelectMessage, closeSelection } =
    useFunctionStore();

  const { socket } = useAuthStore();
  const messageEndRef = useRef();

  useEffect(() => {
    getMessage();
    suscribeToMessage();
    return () => unsuscribeFromMessage();
  }, [getMessage, suscribeToMessage, socket, unsuscribeFromMessage]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessageLoading) return <MessageLoadingSkeleton />;
  return (
    <>
      <div className="flex-1 p-1 space-y-1 overflow-y-scroll h-full">
        {messages.map((message, i) => (
          <div ref={messageEndRef} key={i} className="flex w-full items-center">
            {isSelectMessage && (
              <input
                type="checkbox"
                onClick={() => onSelectMessage(message)}
                className="checkbox ml-2 checkbox-primary text-primary-content"
              />
            )}
            <div
              className={`chat w-full h ${
                message.sender != currentChatingUser ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble rounded-xl  max-w-[80%] px-2 py-1 ${
                  message.sender != currentChatingUser
                    ? "bg-primary/70 text-primary-content"
                    : "bg-base-300 text-base-content"
                }`}
              >
                {message.type == "text" && (
                  <p className="text-sm">{message.data}</p>
                )}
                {message.type == "image" && (
                  <img
                    src={message.data[0].url}
                    alt="image"
                    className="w-72 h-52 rounded-xl"
                  />
                )}
                {message.type == "video" && (
                  <video
                    controls
                    src={`${message.data[0].url}`}
                    className="w-72 rounded-xl"
                  />
                )}
                {message.type == "file" && (
                  <>
                    <div
                      className={`flex items-start gap-2 ${
                        message.sender != currentChatingUser
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
                {message.type == "multiple-file" && (
                  <div
                    className={`grid ${
                      message.data.length == 2
                        ? "grid-cols-1 grid-rows-2"
                        : "grid-cols-2 grid-rows-2"
                    }    w-72 h-52 gap-2 mt-1`}
                  >
                    {message.data.slice(0, 4).map((item, i) => {
                      return (
                        <div
                          key={i}
                          className={`relative ${
                            message.data.length <= 3 && i == 2
                              ? "col-span-2"
                              : "col-span-1"
                          }`}
                        >
                          {message.data.length > 4 && i == 3 && (
                            <div className="absolute w-full text-white   h-full text-4xl font-semibold flex items-center justify-center">
                              +{message.data.length - 3}
                            </div>
                          )}
                          {item.type == "image" ? (
                            <img
                              src={item.url}
                              alt="image"
                              className="h-full w-full rounded-xl object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              controls
                              className="h-full w-full rounded-xl object-fill"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {message.type == "poll" && <Poll data={message.data} />}
                {message.type == "location" && (
                  <div className="w-56 sm:w-64 md:w-72 h-56 z-0 p-0.5">
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
                  className={`text-[10px] text-end flex items-end justify-end ${
                    message.sender != currentChatingUser
                      ? "text-primary-content/70"
                      : "text-base-content/70"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                  {message.sender != currentChatingUser && (
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
        <div className="absolute w-full h-[10%] bg-primary left-0 bottom-0 z-50 flex items-center text-base-content overflow-hidden">
          <IoClose
            onClick={closeSelection}
            size={30}
            className="ml-4 cursor-pointer"
          />
          <p className="flex gap-x-2 items-center text-xl">
            <span className="">{Object.keys(selectMessage).length}</span>{" "}
            Selected
          </p>
          {Object.keys(selectMessage).length > 0 && (
            <div className="flex justify-end w-full mr-3 gap-x-2 ">
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
