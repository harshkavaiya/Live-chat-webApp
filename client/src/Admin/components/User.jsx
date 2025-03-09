import { FiEye, FiRefreshCw } from "react-icons/fi";
import useUsersStore from "../store/useUsersStore";
import SignleUser from "./SignleUser";
import DeleteConfirm from "./DeleteConfirm";
import { BiTrashAlt } from "react-icons/bi";
import UserTable from "../skeleton/userTable";

const User = () => {
  const {
    users,
    currentSee,
    setCurrentSee,
    isDeleting,
    deleteUser,
    isLoading,
    fetchUsers,
  } = useUsersStore();

  return (
    <div className="px-5 py-6">
      {currentSee ? (
        <SignleUser />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Users</h1>
              <p className="text-base-content/70 mt-1">
                Manage all your users from one place
              </p>
            </div>
            <div
              className="btn btn-primary p-2 sm:p-1 h-10 w-10 sm:h-12 sm:w-12 absolute right-2 sm:right-6 mt-5 sm:mt-0"
              onClick={fetchUsers}
            >
              {isLoading ? (
                <span className="loading loading-spinner" />
              ) : (
                <FiRefreshCw size={24} className="" />
              )}
            </div>
          </div>

          <div className="mt-5 border rounded-md overflow-hidden">
            <table className="table w-full">
              <thead>
                <tr className="">
                  <td>Name</td>
                  <td>Mobile No</td>
                  <td>Time</td>
                  <td>View</td>
                </tr>
              </thead>
            </table>

            <div className="max-h-[400px] sm:max-h-[450px] md:max-h-[450px] overflow-y-auto">
              <table className="table w-full">
                <tbody className="w-full">
                  {isLoading && <UserTable />}

                  {!isLoading &&
                    users.map((item, i) => {
                      return (
                        <tr key={i} className="">
                          <td>
                            <div className="flex items-center gap-1">
                              <div className="avatar">
                                <div className="mask mask-squircle h-10 w-10">
                                  <img
                                    src={
                                      item.profilePic ||
                                      "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                                    }
                                    alt="Avatar Tailwind CSS Component"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">{item.fullname}</div>
                                <div className="text-sm opacity-50">India</div>
                              </div>
                            </div>
                          </td>
                          <td>{item.phone}</td>
                          <td>
                            {new Date(item?.createdAt).toLocaleDateString()}
                          </td>
                          <th className="">
                            <div className="flex items-center h-full gap-2">
                              <FiEye
                                onClick={() => setCurrentSee(item)}
                                size={20}
                                className="text-sky-600 cursor-pointer"
                              />
                              <BiTrashAlt
                                onClick={() =>
                                  document
                                    .getElementById("message_delete_Confirm")
                                    .showModal()
                                }
                                size={20}
                                className="text-error cursor-pointer"
                              />
                            </div>
                          </th>
                          <DeleteConfirm
                            title={"User"}
                            isDeleting={isDeleting}
                            deleteData={() => {
                              deleteUser(item._id);
                              document
                                .getElementById("message_delete_Confirm")
                                .close();
                            }}
                          />
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default User;
