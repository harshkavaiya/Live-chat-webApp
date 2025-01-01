import useMessageStore from "../../store/useMessageStore";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "../SendDataPreview/SendFilePreview.css";
import { FreeMode, Thumbs } from "swiper/modules";
import useMediaStore from "../../store/useMediaStore";
import { memo } from "react";

const ThumbnailGallery = () => {
  const { chatUserMedia, onDynamicMedia } = useMediaStore();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-primary/60 text-primary-content p-4">
      {chatUserMedia.length > 0 && (
        <div className="flex gap-2 justify-center overflow-x-auto">
          <Swiper
            spaceBetween={10}
            slidesPerView={10}
            freeMode={true}
            lazy={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Thumbs]}
            className="w-[80%] md:w-[60%] h-[10%]"
          >
            {chatUserMedia.map((item, i) => {
              return (
                <SwiperSlide key={i} className="relative">
                  {item.current.type == "video" ? (
                    <video
                      loading="lazy"
                      onClick={() => onDynamicMedia(i)}
                      className="border border-primary h-14 w-16 rounded-md object-cover"
                      src={`${item.current.url}#t=2.1`}
                    />
                  ) : (
                    <img
                      src={item.current.url}
                      loading="lazy"
                      onClick={() => onDynamicMedia(i)}
                      className="border border-primary h-14 w-16 rounded-md object-cover"
                    />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
          {/* {chatUserMedia.map((image, index) => (
          <div
            key={index}
            className={`w-16 h-16 flex-shrink-0 cursor-pointer transition-all ${
              currentIndex === index ? "border-2 border-blue-500" : "opacity-70"
            }`}
            onClick={() => onSelect(index)}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))} */}
        </div>
      )}
    </div>
  );
};

export default memo(ThumbnailGallery);
