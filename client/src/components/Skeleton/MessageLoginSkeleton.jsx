const MessageLoadingSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(7).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-1 space-y-2.5">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          {/* <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div> */}

          {/* <div className="chat-header mb-1">
            <div className="skeleton h-4 w-20" />
          </div> */}

          <div
            className={`chat-bubble ${
              idx % 2 === 0 ? "bg-base-300" : "bg-primary"
            } skeleton h-14 w-[60vw] md:w-[40vw] `}
          />
        </div>
      ))}
    </div>
  );
};

export default MessageLoadingSkeleton;
