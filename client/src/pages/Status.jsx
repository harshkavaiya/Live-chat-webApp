import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import StatusShow from "../components/Status/StatusShow";

const Status = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(null);
  const users = [
    {
      username: "user1",
    },
    {
      username: "user2",
    },
    {
      username: "user3",
    },
  ];

  const openStory = (index) => {
    setCurrentStoryIndex(index);
    document.getElementById("my_modal_3").showModal();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* story logo */}
      <div className="flex items-center justify-between px-3 pt-2">
        <h2 className="font-bold text-lg">Story</h2>
        <span className="w-9 h-9 rounded-full grid place-items-center hover:bg-base-100 transition-all duration-150 cursor-pointer">
          <FaPlus size={20} />
        </span>
      </div>
      {/* story */}
      <div className="flex flex-col overflow-y-auto overflow-x-hidden">
        {/* my story */}
        <div className="flex px-4 items-center gap-4 py-2 hover:bg-primary/10 cursor-pointer">
          <div className="indicator relative cursor-pointer">
            <span className="indicator-item badge badge-accent rounded-full absolute w-5 h-5 p-0 top-11 right-2">
              <FaPlus size={11} />
            </span>
            <div className="bg-base-300 grid w-14 h-14 place-items-center rounded-full overflow-hidden">
              <img
                src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                alt="user"
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-px">
            <p className="font-semibold">My Story</p>
            <p className="text-sm">Click to add story</p>
          </div>
        </div>
        <div className="divider mt-2 mb-2 h-2 divider-primary" />

        {/* recent story */}
        <div className="flex flex-col gap-1 mb-6">
          <div className="divider divider-start pl-6 uppercase">Recent</div>

          {users.map((i, idx) => (
            <div
              key={idx}
              className="flex px-4 gap-3 items-center cursor-pointer py-2 hover:bg-primary/10"
              onClick={() => openStory(idx)}
            >
              <div className="bg-base-300 grid w-14 h-14 place-items-center rounded-full overflow-hidden">
                <img
                  src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                  alt="user"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-px">
                <p className="font-semibold">{i.username}</p>
                <p className="text-sm">Today at 10:12 PM</p>
              </div>
            </div>
          ))}
        </div>
        {/* View story */}
        <div className="flex flex-col gap-1 pb-10">
          <div className="divider divider-start pl-6 uppercase">Viewed</div>
          {users.map((i, idx) => (
            <div
              key={idx}
              className="flex px-4 gap-3 items-center py-2 hover:bg-primary/10 cursor-pointer"
            >
              <div className="bg-base-300 grid w-14 h-14 place-items-center rounded-full overflow-hidden">
                <img
                  src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                  alt="user"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-px">
                <p className="font-semibold">{i.username}</p>
                <p className="text-sm">Today at 10:12 PM</p>
              </div>
            </div>
          ))}

          <div className="divider m-0  text-xs">end-to-end encrypted</div>
        </div>
      </div>
      <StatusShow
        currentStoryIndex={currentStoryIndex}
        setCurrentStoryIndex={setCurrentStoryIndex}
      />
    </div>
  );
};

export default Status;
