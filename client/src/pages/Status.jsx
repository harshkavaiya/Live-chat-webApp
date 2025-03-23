import { useCallback, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import StatusShow from "../components/Status/StatusShow";
import useStatusStore from "../store/useStatusStore";
import StatusRing from "../components/Status/StatusRing";
import useMessageStore from "../store/useMessageStore";
import useAuthStore from "../store/useAuthStore";
import ReactTimeAgo from "react-time-ago";

const Status = () => {
  const { messagerUser } = useMessageStore();
  const { authUser } = useAuthStore.getState();
  const {
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

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* select Status file */}
        <SelectFile />
        {/* story logo */}
        <div className="flex justify-between items-center pt-2 px-3">
          <h2 className="text-lg font-bold">Story</h2>
          <label
            htmlFor="selectfile"
            className="grid h-9 rounded-full w-9 cursor-pointer duration-150 hover:bg-base-100 place-items-center transition-all"
          >
            <FaPlus size={20} />
          </label>
        </div>
        {/* story */}
        <div className="flex flex-col overflow-x-hidden overflow-y-auto">
          {/* my story */}

          <label
            htmlFor={`${myStatus.length <= 0 ? "selectfile" : ""}`}
            onClick={() => {
              if (myStatus.length > 0) setIsStatusPageOpen(true);
            }}
            className="flex cursor-pointer gap-4 hover:bg-primary/10 items-center px-4 py-2"
          >
            {myStatus.length > 0 ? (
              <StatusRing
                imageSrc={
                  authUser?.profilePic || //status user dynamic photo show
                  "data:image/png;base64,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"
                }
                totalStatuses={myStatus.length}
                viewedStatuses={myStatus.length}
              />
            ) : (
              <div className="cursor-pointer indicator relative">
                <div className="badge badge-accent h-5 p-0 rounded-full w-5 absolute indicator-item right-2 top-11">
                  <FaPlus />
                </div>
                <div className="grid bg-base-300 h-14 rounded-full w-14 overflow-hidden place-items-center">
                  <img
                    src={
                      authUser?.profilePic ||
                     "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                    }
                    alt="user"
                    className="h-full w-full object-center object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-px">
              <p className="font-semibold">My Story</p>
              <p className="text-sm">Click to add story</p>
            </div>
          </label>

          <div className="h-2 divider divider-primary mb-2 mt-2" />

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
                      className="flex cursor-pointer gap-3 hover:bg-primary/10 items-center px-4 py-2"
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
                        <p className="font-semibold">{item.name}</p>
                        <ReactTimeAgo
                          className="text-sm"
                          date={status[status.length - 1].time}
                        />
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
                      className="flex cursor-pointer gap-3 hover:bg-primary/10 items-center px-4 py-2"
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
                        <p className="font-semibold">{item.name}</p>

                        <ReactTimeAgo
                          className="text-sm"
                          date={status[status.length - 1].time}
                        />
                      </div>
                    </div>
                  );
              })}
          </div>
        </div>
        {currentStatusIndex != null && <StatusShow />}
      </div>
    </>
  );
};
export const SelectFile = () => {
  const { setStatus } = useStatusStore();
  const handleStatusData = (data) => {
    data.preventDefault();
    const { files } = data.target;
    setStatus([...files]);
    data.target.value = "";
  };
  return (
    <input
      id="selectfile"
      type="file"
      onChange={handleStatusData}
      className="hidden"
      multiple
      accept=".jpg,.mp4,.png,.jpeg"
    />
  );
};
export default Status;
