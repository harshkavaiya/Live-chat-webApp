import { IoMenu } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";

const Navbar = ({setCurrentTab}) => {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-none">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
            <IoMenu size={25} />
          </label>
        </div>
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
      </div>
      <div className="drawer z-40">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 gap-2">
            <li className="">
              <label
                htmlFor="my-drawer"
                onClick={() => setCurrentTab("Users")}
                className="flex items-center w-full justify-start"
              >
                <FaUserFriends size={20} />
                <p>Users</p>
              </label>
            </li>
            <li className="flex items-center w-full justify-start">
              <label
                htmlFor="my-drawer"
                onClick={() => setCurrentTab("Groups")}
                className="flex items-center w-full justify-start"
              >
                <HiMiniUserGroup size={20} />
                <p>Groups</p>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
