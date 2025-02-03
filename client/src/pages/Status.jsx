import { useCallback, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import StatusShow from "../components/Status/StatusShow";
import useStatusStore from "../store/useStatusStore";
import StatusRing from "../components/Status/StatusRing";
import useMessageStore from "../store/useMessageStore";

const Status = () => {
  const { messagerUser } = useMessageStore();

  const {
    setStatus,
    myStatus,
    setIsStatusPageOpen,
    friendStatus,
    fetchFreindStatus,
    setCurrentRunningStatus,
    setCurrentStatusIndex,
    currentStatusIndex,
    setCurrentUserRunningStatus,
  } = useStatusStore();

  useEffect(() => {
    fetchFreindStatus(messagerUser);
  }, []);

  const openStory = useCallback((index, data) => {
    setCurrentRunningStatus(data);
    if (friendStatus[index].seen == data.length) {
      setCurrentStatusIndex(index);
    } else {
      setCurrentStatusIndex(friendStatus[index].seen);
    }
    setCurrentUserRunningStatus(index);
  });

  const handleStatusData = (data) => {
    const { files } = data.target;
    setStatus([...files]);
  };
  return (
    <>
      <div className="flex flex-col h-screen">
        {/* select Status file */}
        <input
          id="selectfile"
          type="file"
          onChange={handleStatusData}
          className="hidden"
          multiple
          accept=".jpg,.mp4,.png,.jpeg"
        />
        {/* story logo */}
        <div className="flex items-center justify-between px-3 pt-2">
          <h2 className="font-bold text-lg">Story</h2>
          <label
            htmlFor="selectfile"
            className="w-9 h-9 rounded-full grid place-items-center hover:bg-base-100 transition-all duration-150 cursor-pointer"
          >
            <FaPlus size={20} />
          </label>
        </div>
        {/* story */}
        <div className="flex flex-col overflow-y-auto overflow-x-hidden">
          {/* my story */}

          <label
            htmlFor={`${myStatus.length <= 0 ? "selectfile" : ""}`}
            onClick={() => {
              if (myStatus.length > 0) setIsStatusPageOpen(true);
            }}
            className="flex px-4 items-center gap-4 py-2 hover:bg-primary/10 cursor-pointer"
          >
            {myStatus.length > 0 ? (
              <StatusRing
                imageSrc="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                totalStatuses={myStatus.length}
                viewedStatuses={myStatus.length}
              />
            ) : (
              <div className="indicator relative cursor-pointer">
                <div className="indicator-item badge badge-accent rounded-full absolute w-5 h-5 p-0 top-11 right-2">
                  <FaPlus />
                </div>
                <div className="bg-base-300 grid w-14 h-14 place-items-center rounded-full overflow-hidden">
                  <img
                    src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                    alt="user"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-px">
              <p className="font-semibold">My Story</p>
              <p className="text-sm">Click to add story</p>
            </div>
          </label>

          <div className="divider mt-2 mb-2 h-2 divider-primary" />

          {/* recent story */}
          <div className="flex flex-col gap-1 mb-6">
            <div className="divider divider-start pl-6 uppercase">Recent</div>

            {friendStatus &&
              friendStatus.map((item, idx) => {
                const { status } = item;
                if (item.seen != status.length)
                  return (
                    <div
                      key={idx}
                      className="flex px-4 gap-3 items-center cursor-pointer py-2 hover:bg-primary/10"
                      onClick={() => openStory(idx, status)}
                    >
                      <StatusRing
                        imageSrc={
                          status[0].type == "video"
                            ? `${status[0].url}#0.1`
                            : status[0].url
                        }
                        type={status[0].type}
                        totalStatuses={status.length}
                        viewedStatuses={item.seen}
                      />
                      <div className="flex flex-col gap-px">
                        <p className="font-semibold">df</p>
                        <p className="text-sm">Today at 10:12 PM</p>
                      </div>
                    </div>
                  );
              })}
          </div>
          {/* View story */}
          <div className="flex flex-col gap-1 pb-10">
            <div className="divider divider-start pl-6 uppercase">Viewed</div>
            {friendStatus &&
              friendStatus.map((item, idx) => {
                const { status } = item;
                if (item.seen == status.length)
                  return (
                    <div
                      key={idx}
                      className="flex px-4 gap-3 items-center cursor-pointer py-2 hover:bg-primary/10"
                      onClick={() => openStory(idx, status)}
                    >
                      <StatusRing
                        imageSrc={
                          status[0].type == "video"
                            ? `${status[0].url}#0.1`
                            : status[0].url
                        }
                        type={status[0].type}
                        totalStatuses={status.length}
                        viewedStatuses={item.seen}
                      />
                      <div className="flex flex-col gap-px">
                        <p className="font-semibold">df</p>
                        <p className="text-sm">Today at 10:12 PM</p>
                      </div>
                    </div>
                  );
              })}
            <div className="divider m-0  text-xs">end-to-end encrypted</div>
          </div>
        </div>
        {currentStatusIndex != null && <StatusShow />}
      </div>
    </>
  );
};

export default Status;
