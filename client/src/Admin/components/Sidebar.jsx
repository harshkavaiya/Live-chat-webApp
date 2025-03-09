import {
  FaComments,
  FaHome,
  FaSignOutAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import useHomeStore from "../store/useHomeStore";
import { useState } from "react";

const Sidebar = () => {
  const { currentTab, setCurrentTab } = useHomeStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="drawer-side">
      <label
        htmlFor="drawer-toggle"
        onClick={() => setCurrentTab("Dashboard")}
        className="drawer-overlay"
      ></label>
      <div
        className={`bg-base-200 relative ${
          collapsed ? "w-20" : "w-80"
        } h-full transition-all duration-300 ease-in-out`}
      >
        <div className="navbar bg-base-200 border-b ">
          {!collapsed && (
            <div className="flex-1 px-4">
              <div className="flex items-center gap-2">
                <FaComments size={24} className="text-primary" />
                <span className="text-xl font-bold">BaatCheet</span>
              </div>
            </div>
          )}
          <IoMenu
            onClick={() => setCollapsed(!collapsed)}
            size={24}
            className={`${
              !collapsed ? "absolute right-2" : "flex-1 items-center"
            } cursor-pointer`}
          />
        </div>

        <ul className="menu p-4 text-base-content">
          <li>
            <NavItem
              icon={<FaHome />}
              text="Dashboard"
              click={() => setCurrentTab("Dashboard")}
              active={currentTab == "Dashboard"}
              collapsed={collapsed}
            />
          </li>
          <li>
            <NavItem
              icon={<FaUser />}
              text="Users"
              click={() => setCurrentTab("Users")}
              active={currentTab == "Users"}
              collapsed={collapsed}
            />
          </li>
          <li>
            <NavItem
              icon={<FaUsers />}
              text="Groups"
              click={() => setCurrentTab("Groups")}
              active={currentTab == "Groups"}
              collapsed={collapsed}
            />
          </li>
        </ul>

        <div className="absolute bottom-0 w-full border-t p-4">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src="/placeholder-user.jpg"
                  width={48}
                  height={48}
                  alt="User"
                />
              </div>
            </div>
            <div>
              <div className="font-bold">Admin User</div>
              <div className="text-sm opacity-70">admin@example.com</div>
            </div>
            <button className="btn btn-ghost btn-circle ml-auto">
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, click, text, active = false, collapsed = false }) => {
  return (
    <label
      htmlFor="drawer-toggle"
      onClick={click}
      className={` border-none
        flex items-center p-3 rounded-xl transition-all duration-200 outline-none
        ${
          active
            ? "bg-gradient-to-r from-primary/70 to-secondary/60 text-white shadow-lg"
            : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
        }
        ${collapsed ? "justify-center" : ""}
      `}
    >
      <div className={`${collapsed ? "text-xl" : "text-lg mr-3"}`}>{icon}</div>
      {!collapsed && <span className="font-medium">{text}</span>}
    </label>
  );
};

export default Sidebar;
