import { FaSearch, FaTrash } from "react-icons/fa";
import useGroupStore from "../store/useGroupStore";
import { useState } from "react";
import DeleteConfirm from "./DeleteConfirm";

const SignleGroup = () => {
  const { setCurrentSee, currentSee, deleteGroup, isDeleting } =
    useGroupStore();
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setCurrentSee(null)}
        >
          &larr; Back to Groups
        </button>
        <h1 className="text-2xl font-bold mt-2 sm:mt-0">{currentSee?.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Group Info Card */}
        <div className="lg:col-span-1">
          <div className="card bg-base-200 shadow-xl">
            <figure className="px-6 py-2">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      currentSee?.photo ||
                      "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                    }
                    alt={currentSee?.name}
                    width={128}
                    height={128}
                  />
                </div>
              </div>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl">{currentSee?.name}</h2>

              <div className="stats shadow mt-4 w-full">
                <div className="stat place-items-center">
                  <div className="stat-title">Members</div>
                  <div className="stat-value text-primary">
                    {currentSee?.members?.length}
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="w-full">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-semibold text-left">Created By:</div>
                  <div className="text-right">
                    {currentSee?.admin?.fullname}
                  </div>

                  <div className="font-semibold text-left">Created Date:</div>
                  <div className="text-right">
                    {new Date(currentSee?.createdAt).toLocaleDateString()}
                  </div>

                  <div className="font-semibold text-left">Group Type:</div>
                  <div className="text-right">{currentSee?.type}</div>
                </div>
              </div>

              <div className="card-actions justify-end w-full mt-6">
                <div
                  onClick={() =>
                    document
                      .getElementById("message_delete_Confirm")
                      .showModal()
                  }
                  className="btn btn-error flex items-center"
                >
                  <FaTrash className="mr-2" size={14} />
                  Delete Group
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="lg:col-span-2">
          <div className="tabs tabs-boxed mb-6">
            <a
              className={`tab ${activeTab === "about" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              About
            </a>
            <a
              className={`tab ${activeTab === "members" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("members")}
            >
              Members
            </a>
          </div>

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Description</h3>
                  <p className="mt-2">{currentSee?.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="card-title">
                    Members ({currentSee.members.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="input flex items-center">
                      <FaSearch className="mr-2" />
                      <input
                        type="search"
                        className="grow"
                        placeholder="Search"
                      />
                    </label>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        {/* <th>Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {currentSee.members.map((member) => (
                        <tr key={member._id}>
                          <td>
                            <div className="flex items-center space-x-3">
                              <div className="avatar">
                                <div className="mask mask-squircle w-10 h-10">
                                  <img
                                    src={
                                      member.profilePic ||
                                      "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                                    }
                                    alt={member.fullname}
                                    width={40}
                                    height={40}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">
                                  {member.fullname}
                                </div>
                                {currentSee.admins.includes(member._id) && (
                                  <div className="badge badge-primary badge-sm">
                                    Admin
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{member.email}</td>

                          {/* <td>
                            <div className="dropdown dropdown-end">
                              <label
                                tabIndex={0}
                                className="btn btn-ghost btn-xs"
                              >
                                Actions
                                <FaChevronDown className="ml-1" size={12} />
                              </label>
                              <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                              >
                                {member.role !== "Admin" && (
                                  <li>
                                    <a>
                                      <FaUserCog className="mr-2" size={14} />
                                      Promote to Admin
                                    </a>
                                  </li>
                                )}
                                <li>
                                  <a>
                                    <FaComments className="mr-2" size={14} />
                                    Message
                                  </a>
                                </li>
                                <li>
                                  <a>
                                    <FaUserMinus className="mr-2" size={14} />
                                    Remove from Group
                                  </a>
                                </li>
                                <li>
                                  <a className="text-error">
                                    <FaBan className="mr-2" size={14} />
                                    Block User
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirm
        isDeleting={isDeleting}
        title={"Group"}
        deleteData={() => {
          deleteGroup(currentSee._id);
          setCurrentSee(null);
        }}
      />
    </div>
  );
};

export default SignleGroup;
