import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { MdModeEdit, MdOutlinePhotoCamera } from "react-icons/md";
import useStatusStore from "../../store/useStatusStore";
import ReactTimeAgo from "react-time-ago";
import ReactInstaStories from "react-insta-stories";

const MyStatusPreview = () => {
  const { myStatus, setIsStatusPageOpen } = useStatusStore();
  const [currentSeeStatus, setCurrentSeeStatus] = useState([]);
  return (
    <div className="absolute w-full h-full flex flex-col items-center backdrop-blur-md z-10">
      <div className="relative flex flex-col h-screen w-full sm:w-[70%] bg-primary/50 text-primary ">
        {/* Status Header */}
        <div className=" flex items-center p-3 bg-primary-content/90 shadow-md">
          <button
            onClick={() => setIsStatusPageOpen(false)}
            className="btn btn-ghost btn-circle"
          >
            <FaArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold ml-4">My Status</h1>
        </div>

        {/* Status Content */}
        <div className="flex-1 p-3 space-y-2 overflow-y-scroll">
          {myStatus?.map((item, i) => {
            const { seen, type, url, time } = item;
            return (
              <div
                key={i}
                onClick={() => setCurrentSeeStatus([item])}
                className="flex items-center cursor-pointer bg-primary-content p-3.5 rounded-lg shadow-lg hover:shadow-xl"
              >
                <div className="avatar">
                  <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-[#233138] ring-offset-2">
                    {type == "image" ? (
                      <img
                        src={url}
                        alt="Profile picture"
                        className="object-cover"
                      />
                    ) : (
                      <video src={`${url}#0.1`} />
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-lg font-semibold text-base-100 ">
                    <span className="mr-2">{seen}</span>Views
                  </div>
                  <div className="text-sm text-base-100/70">
                    <ReactTimeAgo date={time} />
                  </div>
                </div>
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle text-base-100 hover:bg-primary/20"
                  >
                    <CgMoreVerticalAlt className="h-5 w-5" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow-lg bg-neutral text-base-100 rounded-box w-52"
                  >
                    <li>
                      <button className="hover:bg-base-300/20">Forward</button>
                    </li>
                    <li>
                      <button className="hover:bg-base-300/20">Share</button>
                    </li>
                    <li>
                      <button className="hover:bg-base-300/20 text-red-400">
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-6 right-6 flex flex-col items-center gap-4">
          <button className="btn btn-circle bg-primary/6  0 text-primary-content hover:bg-primary h-12 w-12 shadow-lg transition-all duration-300 hover:scale-110">
            <MdModeEdit className="h-6 w-6" />
          </button>
          <button className="btn btn-circle bg-primary-content/80 hover:bg-primary-content text-base-100 h-16 w-16 shadow-lg transition-all duration-300 hover:scale-110">
            <MdOutlinePhotoCamera className="h-8 w-8" />
          </button>
        </div>
      </div>
      {currentSeeStatus.length > 0 && (
        <div
          onClick={() => setCurrentSeeStatus([])}
          className="absolute w-full backdrop-blur-md flex items-center justify-center"
        >
          <ReactInstaStories
            stories={currentSeeStatus}
            onAllStoriesEnd={() => setCurrentSeeStatus([])}
            onNext={() => console.log("df")}
            storyStyles={{
              objectFit: "cover",
              height: "100vh",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MyStatusPreview;
