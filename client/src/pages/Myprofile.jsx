import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Myprofile = () => {
  const [menuOpen, setMenu] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const menuHandler = (e) => {
    const { clientX, clientY } = e;
    setPosition({ top: clientY, left: clientX });
    setMenu(!menuOpen);
  };
  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      onClick={menuOpen ? () => setMenu(false) : undefined}
    >
      {/* profile text */}
      <div className="p-4">
        <h2 className="text-2xl font-bold">My Profile</h2>
      </div>
      {/* user profile */}
      <div className="flex justify-center items-center">
        <div className="rounded-full relative overflow-hidden w-44 h-44">
          <span
            className="w-full h-full flex flex-col items-center justify-center rounded-full bg-opacity-30 bg-secondary cursor-pointer opacity-0 hover:opacity-100 absolute gap-5"
            onClick={menuHandler}
          >
            <FaCamera size={25} className="text-primary-content" />
            <p className="text-base text-center font-semibold text-primary-content">
              CHANGE PROFILE PHOTO
            </p>
          </span>
          <img
            src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
            alt="myprofile"
            className="object-cover"
          />
        </div>
      </div>

      {/* menus */}
      {menuOpen && (
        <ul
          className="menu absolute bg-base-200 rounded-box w-56"
          style={{
            top: position.top + 10,
            left: position.left - 65,
          }}
        >
          <li>
            <a>
              <FaFolder size={20} />
              Upload photo
            </a>
          </li>
          <li>
            <a className="text-red-500">
              <MdDelete size={20} />
              Remove
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Myprofile;
