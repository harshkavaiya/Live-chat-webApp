import React, { memo } from "react";

const Image = ({ src, handleMediaPreview }) => {
  return (
    <img
      src={src}
      alt="image"
      onClick={() => handleMediaPreview(true, message.data[0].url)}
      className="w-72 h-52 rounded-xl object-cover cursor-pointer"
    />
  );
};

export default memo(Image);
