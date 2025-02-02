const StatusProgressBar = ({
  isProcess,
  currentRunningStatus,
  currentStatusIndex,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 flex space-x-1 p-2 z-10">
      {currentRunningStatus.map((_, index) => (
        <div
          key={index}
          className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-white transition-all duration-100 ease-out"
            style={{
              width:
                index === currentStatusIndex
                  ? `${isProcess}%`
                  : index < currentStatusIndex
                  ? "100%"
                  : "0%",
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default StatusProgressBar;
