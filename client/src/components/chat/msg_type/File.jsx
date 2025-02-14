import useMessageStore from "../../../store/useMessageStore";

const File = ({ sender,data }) => {
  const { currentChatingUser } = useMessageStore();
  return (
    <div
      className={`flex items-start gap-2 ${
        sender != currentChatingUser._id
          ? "bg-base-100/25 text-primary-content "
          : "bg-base-100 text-base-content"
      } p-1 rounded-lg w-[55vw]  md:w-60`}
    >
      {/* File Icon */}
      <div className=" p-2 rounded-lg">
        <BsFileText className="text-2xl " />
      </div>

      {/* File Info */}
      <div className="flex-1">
        <div className="font-medium text-sm truncate">{data.name}</div>
        <div className="text-xs ">{data.size}</div>
      </div>

      {/* Download Icon */}
      <button className="btn btn-ghost btn-circle btn-sm">
        <BiDownload className="text-xl " />
      </button>
    </div>
  );
};

export default File;
