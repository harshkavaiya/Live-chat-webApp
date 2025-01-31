import React, { memo } from "react";
import useMessageStore from "../../../store/useMessageStore";

const Image = ({ src, handleMediaPreview ,message}) => {

  return (
    <img
      src={src}
      alt="image"
      onClick={() => handleMediaPreview(true, message.data[0].url)}
      className="w-60 h-52 rounded-xl object-cover cursor-pointer"
    />
  );
};

export default memo(Image);
