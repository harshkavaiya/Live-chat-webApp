import { FaRegTrashAlt, FaTimes } from "react-icons/fa";
import { MdOutlineCrop } from "react-icons/md";
import { RiText } from "react-icons/ri";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "../SendDataPreview/SendFilePreview.css";

import { FreeMode, Thumbs } from "swiper/modules";
import { useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import useStatusStore from "../../store/useStatusStore";

const StatusPreview = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { status, setStatus, uploadStatus, isUploadingstatus } =
    useStatusStore();
  const videoRef = useRef(null);
  const handleDeleteStatus = (i) => {
    const newStatus = status.filter((_, index) => index !== i);
    setStatus(newStatus);
  };

  const handleMetadataCapture = (e) => {
    console.log(e.target.duration);
  };

  return (
    <div className="h-full w-full px-2 md:px-40 lg:px-80 absolute top-0 left-0 mx-auto bg-base-100 text-base-content z-50 ">
      {/* Main Image */}
      <div className="relative w-full">
        {/* Top toolbar */}
        <div className="top-0 left-0 right-0 h-14 p-2 flex items-center justify-between">
          <button className="btn btn-circle">
            <FaTimes onClick={() => setStatus([])} size={20} />
          </button>

          <div className="flex items-center gap-1">
            <button className="btn btn-circle">
              <MdOutlineCrop size={20} />
            </button>

            <button className="btn btn-circle">
              <RiText size={20} />
            </button>
          </div>
        </div>

        {/* middle Image Slider */}
        <div className="z-10 w-full h-[70vh] sm:h-[75vh]">
          <Swiper
            spaceBetween={10}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Thumbs]}
            lazy={true}
            className="mySwiper2 "
          >
            {status.map((item, i) => {
              return (
                <SwiperSlide key={i} className="=">
                  {item.type == "video/mp4" ? (
                    <video
                      src={URL.createObjectURL(item)}
                      type={item.type}
                      controls
                      ref={videoRef}
                      onLoadedMetadataCapture={handleMetadataCapture}
                      className="z-0"
                    />
                  ) : (
                    <img src={URL.createObjectURL(item)} className="" />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            lazy={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Thumbs]}
            className="mySwiper"
          >
            {status.map((item, i) => {
              return (
                <SwiperSlide key={i} className="relative group">
                  <div className="absolute flex items-center justify-center w-full h-full group-hover:opacity-90 opacity-0 transition-all duration-200">
                    <FaRegTrashAlt
                      size={20}
                      className="cursor-pointer "
                      onClick={() => handleDeleteStatus(i)}
                    />
                  </div>

                  {item.type == "video/mp4" ? (
                    <video
                      className="border border-primary"
                      src={`${URL.createObjectURL(item)}#t=0.1`}
                      ref={videoRef}
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(item)}
                      loading="lazy"
                      className="border border-primary"
                    />
                  )}
                </SwiperSlide>
              );
            })}
            <SwiperSlide className="border border-primary rounded-xl text-primary hover:bg-primary/20 cursor-pointer hover:text-primary-content">
              <label className="h-full w-full flex items-center justify-center">
                <span className="">
                  <FaPlus size={20} className="" />
                </span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    setStatus([...status, ...e.target.files]);
                  }}
                  accept=".jpg,.png,.jpeg,.mp4,.mkv"
                />
              </label>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Bottom section */}
        <div className="h-24">
          {/* Caption input */}
          <div className="flex items-center gap-4 p-2">
            <div className="flex-1 bg-white/10 rounded-full px-4 py-2 border border-primary">
              <input
                type="text"
                placeholder="Add a caption..."
                className="w-full bg-transparent  outline-none"
              />
            </div>
            <button
              onClick={uploadStatus}
              className="btn btn-circle btn-primary"
            >
              <IoSend size={24} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {isUploadingstatus && (
          <div className="absolute w-full h-full top-0 z-10 ">
            <span className="flex items-center justify-center w-full h-full animate-pulse text-6xl -mt-10 ">
              Uploading...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPreview;
