import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const NotificationToast = (message, type, name, profilePic) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src={
                  profilePic ||
                  "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                }
                alt=""
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="mt-1 text-sm text-gray-500">
                {type == "text" && <span className="truncate">{message}</span>}
                {type == "location" && <span>Location</span>}
                {type == "poll" && <span>Poll</span>}
                {type == "image" && <span>Image</span>}
                {type == "video" && <span>Video</span>}
                {type == "audio" && <span>Audio</span>}
                {type == "multiple-file" && <span>Multiple File</span>}
                {type == "file" && <span>File</span>}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200 outline-none">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ),
    { duration: 3000 }
  );
};

export default NotificationToast;
