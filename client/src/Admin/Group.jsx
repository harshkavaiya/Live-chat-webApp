import { FaEdit, FaEllipsisV, FaTrash, FaUsers } from "react-icons/fa";
import  useGroupStore  from "./store/useGroupStore";
import { useEffect } from "react";
import SingleGroup from "./SignleGroup";

const Group = () => {
  const {  groups, currentSee, setCurrentSee } = useGroupStore();
  return (
    <div className="p-4 md:p-6 h-screen">
      {currentSee ? (
        <SingleGroup />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Groups</h1>
              <p className="text-base-content/70 mt-1">
                Manage all your groups from one place
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* <div className="text-sm text-base-content/70">
          Showing {sortedGroups.length} of {groups.length} groups
        </div> */}
          </div>

          <div className="h-full overflow-y-auto p-2">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group, i) => (
                <div
                  key={i}
                  className="card border border-primary/10 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  <figure className="relative h-40">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <img
                      src={
                        group.photo ||
                        "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                      }
                      alt={group.name}
                      fill
                      className="object-fill"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white">
                        {group.name}
                      </h3>
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <div className="flex items-center gap-2 text-sm text-base-content/70 mb-1">
                      <FaUsers size={14} />
                      <span>{group.members.length} members</span>
                    </div>

                    <div className="text-sm text-base-content/70">
                      Created: {new Date(group.createdAt).toLocaleDateString()}
                    </div>

                    <div className="card-actions justify-between mt-4">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setCurrentSee(group)}
                      >
                        View Details
                      </button>
                      <div className="dropdown dropdown-end">
                        <label
                          tabIndex={0}
                          className="btn btn-ghost btn-sm btn-circle"
                        >
                          <FaEllipsisV size={16} />
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                          <li>
                            <a>
                              <FaEdit className="mr-2" size={14} />
                              Edit Group
                            </a>
                          </li>
                          <li>
                            <a>
                              <FaUsers className="mr-2" size={14} />
                              Export Members
                            </a>
                          </li>
                          <li>
                            <a className="text-error">
                              <FaTrash className="mr-2" size={14} />
                              Delete Group
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Group;
