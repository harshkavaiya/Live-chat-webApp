import React from "react";
import VideoCall from "../components/call/VideoCall";
import { CiSearch } from "react-icons/ci";
import { GoDotFill } from "react-icons/go";
import { FaAngleDown } from "react-icons/fa";
import { FiPhoneIncoming } from "react-icons/fi";
import { MdCall } from "react-icons/md";
import { FaVideo } from "react-icons/fa6";
import { FiPhoneOutgoing } from "react-icons/fi";

const Calls = () => {
  // onClick={() => document.getElementById("my_modal_1").showModal()}
  const users = [
    {
      name: "John Doe",
      profilePhoto: "https://example.com/profiles/john_doe.jpg",
      callType: "incoming",
      time: "2024-12-26T14:30:00Z",
      misscall: true,
      callNature: "voice",
    },
    {
      name: "Jane Smith",
      profilePhoto: "https://example.com/profiles/jane_smith.jpg",
      callType: "outgoing",
      time: "2024-12-26T15:00:00Z",
      callNature: "video",
    },
    {
      name: "Michael Johnson",
      profilePhoto: "https://example.com/profiles/michael_johnson.jpg",
      callType: "incoming",
      time: "2024-12-26T16:00:00Z",
      misscall: false,
      callNature: "voice",
    },
    {
      name: "Emily Davis",
      profilePhoto: "https://example.com/profiles/emily_davis.jpg",
      callType: "outgoing",
      time: "2024-12-26T17:00:00Z",
      callNature: "voice",
    },
    {
      name: "Chris Brown",
      profilePhoto: "https://example.com/profiles/chris_brown.jpg",
      callType: "incoming",
      time: "2024-12-26T18:30:00Z",
      misscall: true,
      callNature: "voice",
    },
    {
      name: "Sophia Wilson",
      profilePhoto: "https://example.com/profiles/sophia_wilson.jpg",
      callType: "outgoing",
      time: "2024-12-26T19:00:00Z",
      callNature: "video",
    },
    {
      name: "David Miller",
      profilePhoto: "https://example.com/profiles/david_miller.jpg",
      callType: "incoming",
      time: "2024-12-26T20:00:00Z",
      misscall: true,
      callNature: "voice",
    },
    {
      name: "Olivia Moore",
      profilePhoto: "https://example.com/profiles/olivia_moore.jpg",
      callType: "outgoing",
      time: "2024-12-26T21:00:00Z",
      callNature: "video",
    },
    {
      name: "Daniel Taylor",
      profilePhoto: "https://example.com/profiles/daniel_taylor.jpg",
      callType: "incoming",
      time: "2024-12-26T22:00:00Z",
      misscall: false,
      callNature: "voice",
    },
    {
      name: "Isabella Anderson",
      profilePhoto: "https://example.com/profiles/isabella_anderson.jpg",
      callType: "outgoing",
      time: "2024-12-26T23:00:00Z",
      callNature: "video",
    },
  ];

  const receiveCall = false;
  const videoCall = true;
  return (
    <div className="flex flex-col h-screen">
      <VideoCall />

      {/* user message */}
      <div className="flex-1 h-0 flex flex-col">
        <p className="text-lg flex items-center justify-between font-bold pl-2 py-2 cursor-default">
          <span className="flex items-center gap-px">
            Calls
            <div className="badge p-0 ml-1 w-5 h-5 badge-primary">
              {users.length}
            </div>
          </span>
          {/* search */}
          <div className="relative w-full px-4">
            <span className="absolute inset-y-0 left-7 flex items-center text-gray-500">
              <CiSearch size={20} />
            </span>
            <input
              type="search"
              className="input input-primary h-9 w-full pl-10"
              placeholder="Search messages..."
            />
          </div>
        </p>

        {/* messeages list */}
        <div className="overflow-y-auto overflow-x-hidden">
          {users.map((i, idx) => (
            <div
              key={idx}
              className={`flex justify-between pl-4 md:border-b pr-2 border-primary/20 py-2 transition-all duration-75 group hover:bg-primary/10 items-center
                ${idx == users.length - 1 && "border-b"}`}
            >
              <div className="flex items-center">
                <div className="bg-base-300 grid w-14 h-14 border-2 border-primary place-items-center rounded-full overflow-hidden">
                  <img
                    src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                    alt="user"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col ml-3 gap-1">
                  <p
                    className={`text-lg font-semibold ${
                      i.misscall && " text-red-500"
                    }`}
                  >
                    {i.name}
                  </p>
                  <div className="text-xs flex items-center gap-1 text-gray-500">
                    {i.callType == "incoming" ? (
                      <FiPhoneIncoming
                        size={14}
                        className={`${
                          i.misscall ? "text-red-500" : "text-green-600"
                        }`}
                      />
                    ) : (
                      <FiPhoneOutgoing size={14} className="text-green-600" />
                    )}
                    <p>{i.time}</p>
                  </div>
                </div>
              </div>
              <div>
                {i.callNature === "video" ? (
                  <FaVideo size={20} className="cursor-pointer" />
                ) : (
                  <MdCall size={20} className="cursor-pointer" />
                )}
              </div>
            </div>
          ))}
          <div className="mb-36 md:mb-5">
            <div className="divider text-xs">end-to-end encrypted</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calls;
