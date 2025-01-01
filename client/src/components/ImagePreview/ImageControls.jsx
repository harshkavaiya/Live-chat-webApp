import {
  MdClose,
  MdDownload,
  MdStar,
  MdReply,
  MdDelete,
  MdMoreVert,
} from "react-icons/md";
import useMediaStore from "../../store/useMediaStore";
import { memo } from "react";

const ImageControls = () => {
  const { handleMediaPreview, currentMedia } = useMediaStore();
  return (
    <div className="absolute top-0 left-0 right-0 bg-primary/60 text-primary-content p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <button className="btn btn-circle btn-ghost">
          <MdClose size={24} onClick={() => handleMediaPreview(false)} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-circle btn-ghost">
          <MdReply size={24} />
        </button>
        <button className="btn btn-circle btn-ghost">
          <MdStar size={24} />
        </button>
        <a
          src={currentMedia.current.url}
          download
          className="btn btn-circle btn-ghost cursor-pointer"
        >
          <MdDownload size={24} />
        </a>
        <button className="btn btn-circle btn-ghost">
          <MdDelete size={24} />
        </button>
        <button className="btn btn-circle btn-ghost">
          <MdMoreVert size={24} />
        </button>
      </div>
    </div>
  );
};

export default memo(ImageControls);
