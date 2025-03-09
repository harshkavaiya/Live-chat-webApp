import React from "react";

const UserTable = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr>
          <td className="">
            <div className="flex items-center gap-3 ">
              <div className="avatar skeleton w-11 h-11" />
              <div>
                <div className="font-bold skeleton w-20 h-4" />
                <div className="skeleton w-12 h-4 mt-2" />
              </div>
            </div>
          </td>
          <td>
            <div className="skeleton w-24 h-6 rounded-md" />
          </td>
          <td>
            <div className="skeleton w-24 h-6 rounded-md" />
          </td>
          <th className="">
            <div className="flex items-center h-full gap-2">
              <div className="skeleton w-6 h-6 rounded-md" />
              <div className="skeleton w-6 h-6 rounded-md" />
            </div>
          </th>
        </tr>
      ))}
    </>
  );
};

export default UserTable;
