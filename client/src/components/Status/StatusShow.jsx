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
      url: "https://www.w3schools.com/html/mov_bbb.mp4", // MP4 Video
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
        e.preventDefault(); // Prevent the default behavior
      }
    };
    document.addEventListener("keydown", disableEscClose);

    return () => {
      document.removeEventListener("keydown", disableEscClose); // Cleanup
    };
  }, []);
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="w-full h-full bg-base-300 flex flex-col">
        <FaArrowLeft
          size={20}
          className="absolute top-6 z-10 left-5 cursor-pointer"
          onClick={closeStory}
        />

        {currentStoryIndex !== null && (
          <div className="fixed w-full h-full flex items-center justify-center bg-black">
            <Stories
              stories={stories.slice(currentStoryIndex)}
              defaultInterval={3000}
              width="30vw"
              height="100vh"
              onAllStoriesEnd={closeStory}
              storyStyles={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>
    </dialog>
  );
};

export default StatusShow;
