import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import Stories from "react-insta-stories";
import { FaArrowLeft } from "react-icons/fa6";

const StatusShow = ({ currentStoryIndex, setCurrentStoryIndex }) => {
  const stories = [
    {
      url: "https://picsum.photos/1080/1920",
      header: {
        heading: "John Doe",
        subheading: "2 hours ago",
        profileImage: "https://picsum.photos/100/100",
      },
    },
    {
      url: "https://picsum.photos/1080/1920",
      header: {
        heading: "harsh",
        subheading: "5 hours ago",
        profileImage: "https://picsum.photos/100/100",
      },
    },
    {
      url: "https://i.imgur.com/Zo5Kpnd.mp4", // MP4 Video
      type: "video", // Specify type for videos
      header: {
        heading: "Video Story",
        subheading: "10 hours ago",
        profileImage: "https://picsum.photos/100/100",
      },
    },
  ];

  const closeStory = () => {
    setCurrentStoryIndex(null);
    document.getElementById("my_modal_3").close();
  };
  useEffect(() => {
    const disableEscClose = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", disableEscClose);

    return () => {
      document.removeEventListener("keydown", disableEscClose); // Cleanup
    };
  }, []);
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="w-full h-full bg-base-300 flex items-center flex-col">
        <FaArrowLeft
          size={20}
          className="absolute hidden sm:inline top-6 z-10 left-5 cursor-pointer"
          onClick={closeStory}
        />

        {currentStoryIndex !== null && (
          <div className="fixed sm:w-96 w-full h-full flex items-center justify-center bg-black">
            <Stories
              stories={stories.slice(currentStoryIndex)}
              defaultInterval={3000}
              width={"inherit"}
              height="100vh"
              onAllStoriesEnd={closeStory}
              storyStyles={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
            <RxCross2
              size={22}
              className="absolute sm:hidden top-6 right-5 cursor-pointer"
              onClick={closeStory}
            />
          </div>
        )}
      </div>
    </dialog>
  );
};

export default StatusShow;
