import React from "react";

const StatusRing = ({ imageSrc, totalStatuses, viewedStatuses, type }) => {
  const size = 60; // Size of the ring in pixels
  const strokeWidth = 2; // Width of the status segments
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const gapAngle = 11; // Gap between segments in degrees

  const createSegment = (index, total, isViewed) => {
    const segmentAngle = (360 - gapAngle * total) / total;
    const startAngle = index * (segmentAngle + gapAngle);
    const endAngle = startAngle + segmentAngle;

    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);

    const largeArcFlag = segmentAngle <= 180 ? "0" : "1";

    const d = [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");

    return (
      <path
        d={d}
        fill="none"
        stroke={isViewed ? "#111" : "#25D366"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  };

  const segments = Array.from({ length: totalStatuses }, (_, index) =>
    createSegment(index, totalStatuses, index < viewedStatuses)
  );

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* SVG for status segments */}
      <svg
        width={size}
        key={size}
        height={size}
        className="absolute rotate-180"
      >
        {segments}
      </svg>

      {/* Profile picture */}
      <div className="absolute inset-1 overflow-hidden rounded-full">
        {type == "video" ? (
          <video
            src={imageSrc}
            alt="Profile picture"
            width={size - 8}
            height={size - 8}
            className="rounded-full"
          />
        ) : (
          <img
            src={imageSrc}
            alt="Profile picture"
            width={size - 8}
            height={size - 8}
            className="rounded-full"
          />
        )}
      </div>
    </div>
  );
};

export default StatusRing;
