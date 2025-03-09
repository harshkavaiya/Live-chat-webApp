import React, { useState } from "react";
import useUsersStore from "../store/useUsersStore";
import { FaSearch, FaTrash } from "react-icons/fa";
import DeleteConfirm from "./DeleteConfirm";

const SignleUser = () => {
  const { setCurrentSee, currentSee, isDeleting, deleteUser } = useUsersStore();
  const [activeTab, setActiveTab] = useState("about");
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setCurrentSee(null)}
        >
          &larr; Back to Users
        </button>
        <h1 className="text-2xl font-bold mt-2 sm:mt-0">
          {currentSee?.fullname}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="card bg-base-200 shadow-xl">
            <figure className="px-6 py-3">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      currentSee?.profilePic ||
                      "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                    }
                    alt={currentSee?.fullname}
                    width={128}
                    height={128}
                  />
                </div>
              </div>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl">{currentSee?.fullname}</h2>

              <div className="stats shadow mt-4 w-full">
                <div className="stat place-items-center">
                  <div className="stat-title">Contacts</div>
                  <div className="stat-value text-primary">
                    {currentSee?.contacts.length}
                  </div>
                </div>
              </div>

              <div className="divider"></div>

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
                  Delete User
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
              className={`tab ${activeTab === "Contacts" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("Contacts")}
            >
              Contacts
            </a>
          </div>

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Description</h3>
                  <p className="mt-2">{currentSee?.desc}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === "Contacts" && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="card-title">
                    Contacts ({currentSee.contacts.length})
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
                        <th>Phone</th>
                        {/* <th>Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {currentSee.contacts.length > 0 &&
                        currentSee?.contacts?.map((member) => {
                          const { _id, savedName } = member;
                          

                          return (
                            <tr key={_id}>
                              <td>
                                <div className="flex items-center space-x-3">
                                  <div className="avatar">
                                    <div className="mask mask-squircle w-10 h-10">
                                      <img
                                        src={
                                          member?.userId?.profilePic ||
                                          "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                                        }
                                        alt={savedName || "img"}
                                        width={40}
                                        height={40}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-bold">
                                      {member?.userId?.savedName || member?.userId?.fullname}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>{member?.userId?.email}</td>
                              <td>{member?.userId?.phone}</td>
                            </tr>
                          );
                        })}
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
        title={"User"}
        deleteData={() => {
          deleteUser(currentSee._id);
          setCurrentSee(null);
        }}
      />
    </div>
  );
};

export default SignleUser;
