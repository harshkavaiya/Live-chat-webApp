import { FaTimes } from "react-icons/fa";
import { MdOutlineCrop } from "react-icons/md";
import { RiText } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaVideo } from "react-icons/fa";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import { FreeMode, Thumbs } from "swiper/modules";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

const SendFilePreview = ({ GalleryData, setGalleryData }) => {
  console.log(GalleryData);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const handleDeleteImage = (id) => {
    console.log(id);
  };

  return (
    <div className="h-full w-full absolute top-0 mx-auto bg-base-100 text-base-content z-20">
      {/* Main Image */}
      <div className="relative h-full w-full">
        {/* Top toolbar */}
        <div className="top-0 left-0 right-0 h-20 p-2 flex items-center justify-between">
          <button className="btn btn-circle">
            <FaTimes onClick={() => setGalleryData([])} size={20} />
          </button>

          <div className="flex items-center">
            <button className="btn btn-circle">
              <MdOutlineCrop size={20} />
            </button>

            <button className="btn btn-circle">
              <RiText size={20} />
            </button>
          </div>
        </div>

        {/* middle Image Slider */}
        <div className="z-10 w-full h-[75vh]">
          <Swiper
            spaceBetween={10}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Thumbs]}
            className="w-full mx-auto h-[92%]"
          >
            {GalleryData.map((item, i) => {
              return (
                <SwiperSlide key={i} className="h-full w-full">
                  {item.type == "video/mp4" ? (
                    <video
                      src={URL.createObjectURL(item)}
                      type={item.type}
                      controls
                      className="h-full w-full"
                    ></video>
                  ) : (
                    <img
                      src={URL.createObjectURL(item)}
                      className="h-full w-full"
                    />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={3}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Thumbs]}
            className="w-[50%] h-[10%] -mt-4"
          >
            {GalleryData.map((item, i) => {
              return (
                <SwiperSlide key={i} className="h-20 w-20">
                  <div className="relative group">
                    <div className="absolute flex items-center justify-center bg-base-200 w-full h-full bg-transparent/20 text-base-content opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out  ">
                      <FaRegTrashAlt
                        size={30}
                        className="cursor-pointer"
                        onClick={() => handleDeleteImage(item)}
                      />
                    </div>

                    {item.type == "video/mp4" ? (
                      <video width="360">
                        <source
                          src={`${URL.createObjectURL(item)}#t=0.1`}
                          type="video/mp4"
                        />
                      </video>
                    ) : (
                      <img
                        src={URL.createObjectURL(item)}
                        className="hover:opacity-90 rounded-xl object-cover h-full w-full"
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
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
            <button className="btn btn-circle btn-primary">
              <IoSend size={24} />
            </button>
          </div>

          {/* User info */}
          <div className="flex items-center gap-2 px-4 pb-4">
            <span className="font-semibold">{"Hardik"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendFilePreview;
