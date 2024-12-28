import { FaTimes } from "react-icons/fa";
import { MdOutlineCrop } from "react-icons/md";
import { RiText } from "react-icons/ri";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "./SendFilePreview.css";

import { FreeMode, Thumbs } from "swiper/modules";
import { useState } from "react";
import { IoSend } from "react-icons/io5";
import useFucationStore from "../../store/useFuncationStore";

const SendFilePreview = ({ receiver }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { galleryData, sendGalleryData, isGalleryDataUpload } =
    useFucationStore();
  const handleDeleteImage = (id) => {
    console.log(id);
  };
  if (isGalleryDataUpload)
    return (
      <div className="absolute z-30 top-0 w-full h-full flex items-center justify-center">
        <span className="loading loading-infinity loading-lg">Loading</span>
      </div>
    );
  return (
    <div className="h-full w-full absolute top-0 mx-auto bg-base-100 text-base-content z-20">
      {/* Main Image */}
      <div className="relative h-full w-full">
        {/* Top toolbar */}
        <div className="top-0 left-0 right-0 h-14 p-2 flex items-center justify-between">
          <button className="btn btn-circle">
            <FaTimes size={20} />
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
        <div className="z-10 w-full h-[75vh]">
          <Swiper
            spaceBetween={10}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Thumbs]}
            lazy={true}
            className="mySwiper2 "
          >
            {galleryData.map((item, i) => {
              return (
                <SwiperSlide key={i} className="=">
                  {item.type == "video/mp4" ? (
                    <video
                      src={URL.createObjectURL(item)}
                      type={item.type}
                      controls
                      className=""
                    ></video>
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
            {galleryData.map((item, i) => {
              return (
                <SwiperSlide key={i} className="">
                  {/* <div className=" ">
                      <FaRegTrashAlt
                        size={28}
                        className="cursor-pointer"
                        onClick={() => handleDeleteImage(item)}
                      />
                    </div> */}

                  {item.type == "video/mp4" ? (
                    <video className="">
                      <source
                        src={`${URL.createObjectURL(item)}#t=2.1`}
                        type="video/mp4"
                        loading="lazy"
                        className=""
                      />
                    </video>
                  ) : (
                    <img
                      src={URL.createObjectURL(item)}
                      loading="lazy"
                      className=""
                    />
                  )}
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
            <button
              onClick={() => sendGalleryData(galleryData, receiver)}
              className="btn btn-circle btn-primary"
            >
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
