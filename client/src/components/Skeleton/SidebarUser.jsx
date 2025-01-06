
import { CiSearch } from "react-icons/ci";
import { FaAngleRight } from "react-icons/fa";

const SidebarUser = () => {
  return (
    <div className="h-full w-full flex flex-col gap-1 relative transition-all duration-200 ">
      {/* user online */}
      <div className="flex flex-col w-full pl-2 py-2">
        <div className="flex justify-between items-center pr-2">
          <div className="text-lg flex items-center font-bold gap-px cursor-default">
            Online Now
            <div className="badge skeleton p-0 ml-1 w-5 h-5 "></div>
          </div>
          <p className="flex items-center text-sm gap-2 cursor-pointer">
            More <FaAngleRight className="text-primary" />
          </p>
        </div>
        <div className="flex flex-col w-full pl-2 py-2">
          <div className="flex gap-2.5 scrollbar-hide overflow-x-auto">
            {Array(10)
              .fill("")
              .map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="skeleton w-14 h-14 rounded-full"></div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* user message */}
      <div className="flex-1 h-0 flex flex-col">
        <div className="text-lg flex items-center justify-between font-bold pl-2 py-1 cursor-default">
          <span className="text-lg flex items-center font-bold gap-px cursor-default">
            Messages
            <div className="badge skeleton p-0 ml-1 w-5 h-5"></div>
          </span>
          {/* search */}
          <div className="relative w-full px-4">
            <span className="absolute inset-y-0 left-7 flex items-center text-gray-500">
              <CiSearch size={20} />
            </span>
            <input
              type="search"
              className="input input-primary h-9 w-full pl-10"
              placeholder="Search messages..."
            />
          </div>
        </div>

        {/* Messages List Skeleton */}
        <div className="flex-1 h-0 flex flex-col">
          <div className="overflow-y-auto scrollbar-hide overflow-x-hidden">
            {Array(10)
              .fill("")
              .map((_, idx) => (
                <div
                  key={idx}
                  className="flex justify-between pl-4 pr-2 py-2 items-center border-b border-primary/20"
                >
                  <div className="flex items-center">
                    <div className="skeleton w-14 h-14 rounded-full"></div>
                    <div className="flex flex-col ml-3 gap-2">
                      <div className="skeleton h-5 w-24"></div>
                      <div className="skeleton h-4 w-36"></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <div className="skeleton h-4 w-12"></div>
                    <div className="skeleton h-5 w-5 rounded-full"></div>
                  </div>
                </div>
              ))}
            <div className="mb-36 md:mb-5">
              <div className="divider text-xs">end-to-end encrypted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarUser;
