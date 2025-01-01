import { memo, useCallback, useState } from "react";

const ImageZoom = ({ src }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();
      const x = ((e.pageX - left) / width) * 100;
      const y = ((e.pageY - top) / height) * 100;
      setPosition({ x, y });
    },
    [isZoomed]
  );
  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={() => setIsZoomed(!isZoomed)}
      className="w-full h-full"
    >
      <img
        className={`${
          isZoomed ? "cursor-zoom-in" : "cursor-pointer"
        } object-fill`}
        src={src}
        alt="Zoomable"
        style={{
          transform: isZoomed ? `scale(2.5)` : "scale(1)",
          transformOrigin: `${position.x}% ${position.y}%`,
          transition: "transform 0.1s ease-out",
        }}
      />
    </div>
  );
};

export default memo(ImageZoom);
