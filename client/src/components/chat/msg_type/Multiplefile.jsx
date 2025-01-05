import React from 'react'

const Multiplefile = ({message,handleMediaPreview}) => {
  return (
    <div
    className={`grid ${
      message.data.length == 2
        ? "grid-cols-1 grid-rows-2"
        : "grid-cols-2 grid-rows-2"
    }    w-72 h-52 gap-2 mt-1`}
  >
    {message.data.slice(0, 4).map((item, i) => {
      return (
        <div
          key={i}
          className={`relative ${
            message.data.length <= 3 && i == 2
              ? "col-span-2"
              : "col-span-1"
          }`}
        >
          {message.data.length > 4 && i == 3 && (
            <div className="absolute w-full text-white   h-full text-4xl font-semibold flex items-center justify-center">
              +{message.data.length - 3}
            </div>
          )}
          {item.type == "image" ? (
            <img
              src={item.url}
              onClick={() => handleMediaPreview(true, item.url)}
              alt="image"
              className="h-full w-full rounded-xl cursor-pointer object-cover"
            />
          ) : (
            <video
              src={item.url}
              onClick={() => handleMediaPreview(true, item.url)}
              className="h-full w-full rounded-xl cursor-pointer object-fill"
            />
          )}
        </div>
      );
    })}
  </div>
  )
}

export default Multiplefile
