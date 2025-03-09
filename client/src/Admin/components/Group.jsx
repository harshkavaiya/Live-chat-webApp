import { FaTrash, FaUsers } from "react-icons/fa";
import useGroupStore from "../store/useGroupStore";
import SingleGroup from "./SignleGroup";
import { FiRefreshCw } from "react-icons/fi";
import DeleteConfirm from "./DeleteConfirm";

const Group = () => {
  const {
    groups,
    currentSee,
    setCurrentSee,
    fetchGroups,
    deleteGroup,
    isLoading,
    isDeleting,
  } = useGroupStore();
  return (
    <div className="p-4 md:p-6">
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
            <div
              className="btn btn-primary p-2 sm:p-1 h-10 w-10 sm:h-12 sm:w-12 absolute right-2 sm:right-6 mt-5 sm:mt-0"
              onClick={fetchGroups}
            >
              {isLoading ? (
                <span className="loading loading-spinner" />
              ) : (
                <FiRefreshCw size={24} className="" />
              )}
            </div>
          </div>

          <div className="max-h-[500px] sm:max-h-[450px] md:max-h-[500px] overflow-y-auto p-2">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton h-[310px]" />
                  ))
                : groups.map((group, i) => (
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
                          Created:{" "}
                          {new Date(group.createdAt).toLocaleDateString()}
                        </div>

                        <div className="card-actions justify-between mt-4">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setCurrentSee(group)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn btn-error text-base-100 btn-sm"
                            onClick={() =>
                              document
                                .getElementById("message_delete_Confirm")
                                .showModal()
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <DeleteConfirm
                        title={"Group"}
                        isDeleting={isDeleting}
                        deleteData={() => {
                          deleteGroup(group._id);
                          document
                            .getElementById("message_delete_Confirm")
                            .close();
                        }}
                      />
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
