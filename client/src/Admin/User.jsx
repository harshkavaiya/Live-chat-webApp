import { useEffect } from "react";
import { FiEye } from "react-icons/fi";
import useUsersStore from "./store/useUsersStore";
import SignleUser from "./SignleUser";

const User = () => {
  const {  users, currentSee, setCurrentSee } = useUsersStore();


  return (
    <div className="px-5 py-6">
      {currentSee ? (
        <SignleUser />
      ) : (
        <>
          <h1 className="text-4xl font-bold">Users</h1>
          <div className="mt-5 border rounded-md">
            {/* table */}
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile No</th>
                  <th>Time</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
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
                      <td> {new Date(item?.createdAt).toLocaleDateString()}</td>
                      <th>
                        <FiEye
                          onClick={() => setCurrentSee(item)}
                          size={20}
                          className="text-sky-600 cursor-pointer"
                        />
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default User;
