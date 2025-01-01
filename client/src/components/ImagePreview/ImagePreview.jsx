import ImageControls from "./ImageControls";
import ThumbnailGallery from "./ThumbnailGallery";
import useMediaStore from "../../store/useMediaStore";
import CurrentImage from "./CurrentImage";
import { memo } from "react";

const ImagePreview = () => {
  const { chatUserMedia, ischatmediaLoading } = useMediaStore();
  if (ischatmediaLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full text-3xl animate-spin">
        Loading
      </div>
    );
  }
  return (
    <>
      {chatUserMedia.length > 0 ? (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-lg z-50 flex items-center justify-center">
          <ImageControls />
          <CurrentImage />
          <ThumbnailGallery />
        </div>
      ) : (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-lg z-50 flex items-center justify-center text-5xl">
          Not Media Share
        </div>
      )}
    </>
  );
};

export default memo(ImagePreview);
