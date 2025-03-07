import { FiEye } from "react-icons/fi";
import { useGroupStore } from "./store/useGroupStore";
import { useEffect } from "react";

const Group = () => {

  const { fetchGroups } = useGroupStore();

  useEffect(() => {
  fetchGroups();
  }, [])
  
  return (
    <div>
      <h1 className="text-4xl font-bold">Group</h1>
      <div className="mt-5 border rounded-md">
        {/* table */}
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              
              <th>Name</th>
              <th>Member</th>
              <th>Time</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Hart Hagerty</div>
                    <div className="text-sm opacity-50">United States</div>
                  </div>
                </div>
              </td>
              <td>
                Zemlak, Daniel and Leannon
                <br />
                <span className="badge badge-ghost badge-sm">
                  Desktop Support Technician
                </span>
              </td>
              <td>Purple</td>
              <th>
                <FiEye size={20} className="text-sky-600 cursor-pointer"/>
              </th>
            </tr>
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default Group;
