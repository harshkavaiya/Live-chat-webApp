import { MdClose, MdDownload, MdStar, MdMoreVert } from "react-icons/md";
import useMediaStore from "../../store/useMediaStore";
import { memo } from "react";
import { Link } from "react-router-dom";

const ImageControls = () => {
  const { handleMediaPreview, currentMedia } = useMediaStore();
  return (
    <div className="absolute top-0 left-0 right-0 bg-primary/60 text-primary-content p-4 flex justify-between items-center">
      <div className="flex items-center justify-end gap-2 w-full">
        <button className="btn btn-circle btn-ghost">
          <MdClose size={30} onClick={() => handleMediaPreview(false)} />
        </button>
      </div>
    </div>
  );
};

export default memo(ImageControls);
