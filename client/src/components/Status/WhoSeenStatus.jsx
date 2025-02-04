import { memo } from "react";
import ReactTimeAgo from "react-time-ago";

const WhoSeenStatus = ({ viewers, close }) => {
  return (
    <div
      className="fixed inset-0 bg-base-100/50 z-40"
      onClick={close} // Close backdrop on click
    >
      <div
        className="w-full sm:w-[40%] mx-auto right-0 left-0 absolute bottom-0 h-[85%] bg-base-100 rounded-t-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop from closing when content is clicked
      >
        {/* Header */}
        <div className="w-full h-full bg-primary/25 ">
          <div className="flex items-center p-4 border-t border-primary/35 bg-primary-content text-primary font-semibold rounded-t-xl">
            <span>Viewed by {viewers.length}</span>
          </div>

          {/* Viewers List */}
          <div className="overflow-y-auto h-full px-3">
            {viewers.map((viewer, index) => (
              <div key={index} className="flex items-center py-3">
                <img
                  className="w-12 h-12 rounded-full mr-4"
                  src={viewer.profile}
                  alt={`${viewer.name}'s profile`} // Add alt text for accessibility
                />
                <div>
                  <h3 className="font-semibold capitalize">{viewer.name}</h3>
                  <ReactTimeAgo className="text-[11px]" date={viewer.time} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(WhoSeenStatus);
