import  { memo } from "react";
import useMessageStore from "../../../store/useMessageStore";

const Image = ({ src, handleMediaPreview ,message}) => {

  return (
    <img
      src={src}
      alt="image"
      onClick={() => handleMediaPreview(true, src)}
      className="w-60 h-52 rounded-xl object-cover cursor-pointer"
    />
  );
};

export default memo(Image);
