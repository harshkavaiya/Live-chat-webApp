import { RxCross2 } from "react-icons/rx";
import Stories from "react-insta-stories";
import { FaArrowLeft } from "react-icons/fa6";
import useStatusStore from "../../store/useStatusStore";
import { useState } from "react";

const StatusShow = ({
  currentStoryIndex,
  setCurrentStoryIndex,
  data,
  setData,
}) => {
  // const stories = [
  //   {
  //     url: "https://picsum.photos/1080/1920",
  //     header: {
  //       heading: "John Doe",
  //       subheading: "2 hours ago",
  //       profileImage: "https://picsum.photos/100/100",
  //     },
  //   },
  //   {
  //     url: "https://picsum.photos/1080/1920",
  //     header: {
  //       heading: "harsh",
  //       subheading: "5 hours ago",
  //       profileImage: "https://picsum.photos/100/100",
  //     },
  //   },
  //   {
  //     url: "https://i.imgur.com/Zo5Kpnd.mp4", // MP4 Video
  //     type: "video", // Specify type for videos
  //     header: {
  //       heading: "Video Story",
  //       subheading: "10 hours ago",
  //       profileImage: "https://picsum.photos/100/100",
  //     },
  //   },
  // ];
  const { friendStatus } = useStatusStore();

  const [currentRunningStatus, setcurrentRunningStatus] = useState(0);
  const closeStory = () => {
    if (friendStatus[currentStoryIndex + 1]) {
      setData(friendStatus[currentStoryIndex + 1].status);
      return setCurrentStoryIndex((prev) => prev + 1);
    } else {
      setCurrentStoryIndex(null);
      document.getElementById("my_modal_3").close();
    }
  };

  const handleStoryStart = (e) => {
    setCurrentStoryIndex(e);
  };

  const onPrevious = (e) => {
    // pending
  };
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="w-full h-full bg-base-300 flex items-center flex-col">
        <FaArrowLeft
          size={20}
          className="absolute hidden sm:inline top-6 z-10 left-5 cursor-pointer"
          onClick={closeStory}
        />
        {currentStoryIndex !== null && (
          <>
            <div className="fixed sm:w-96 w-[40%] h-full flex items-center justify-center bg-black">
              <Stories
                stories={data}
                defaultInterval={3000}
                width={"inherit"}
                height="100vh"
                onPrevious={onPrevious}
                onStoryStart={handleStoryStart}
                onAllStoriesEnd={closeStory}
                storyStyles={{
                  objectFit: "cover",
                  height: "100vh",
                }}
              />
            </div>
            <span
              className="absolute sm:hidden top-6 p-1 bg-base-300 rounded-full right-5 cursor-pointer"
              onClick={closeStory}
            >
              <RxCross2 size={18} />
            </span>
          </>
        )}
      </div>
    </dialog>
  );
};

export default StatusShow;
