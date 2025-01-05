import React from "react";

const Video = ({ handleMediaPreview, src }) => {
  return (
    <video
      onClick={() => handleMediaPreview(true, item)}
      src={src}
      className="w-72 rounded-xl cursor-pointer"
    />
  );
};

export default Video;
