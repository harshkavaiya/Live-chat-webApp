import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useMediaStore from "../../store/useMediaStore";
import { memo, useEffect } from "react";

const CurrentImage = () => {
  const { currentMedia, onNextMedia, onPrevMedia } = useMediaStore();
  // useEffect(() => {
  //   document.addEventListener(
  //     "keydown",
  //     (e) => {
  //       if (e.key === "ArrowRight") {
  //         console.log(e.key);
  //         onNextMedia();
  //       } else if (e.key === "ArrowLeft") {
  //         onPrevMedia();
  //         console.log(e.key);
  //         return;
  //       }
  //     },
  //     { once: true }
  //   );
  // });
  return (
    <div className="flex items-center h-[80%] justify-between">
      {currentMedia.prev != null && (
        <IoIosArrowBack
          onClick={onPrevMedia}
          size={28}
          className="text-black cursor-pointer"
        />
      )}
      <div className="w-full flex items-center justify-center p-5 h-full">
        {currentMedia.current.type == "video" ? (
          <video
            src={currentMedia.current.url}
            className="object-contain h-full w-full"
            controls
          />
        ) : (
          <img
            src={currentMedia.current.url}
            className="object-contain h-full w-full"
          />
        )}
      </div>
      {currentMedia.next != null && (
        <IoIosArrowForward
          onClick={onNextMedia}
          size={28}
          className="text-black cursor-pointer"
        />
      )}
    </div>
  );
};

export default memo(CurrentImage);
