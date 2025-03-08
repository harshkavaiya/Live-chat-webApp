import { FaComments, FaHome, FaSignOutAlt, FaUser, FaUsers } from "react-icons/fa";
import  useHomeStore  from "./store/useHomeStore";

const Sidebar = () => {
  const { currentTab, setCurrentTab } = useHomeStore();

  return (
    <div className="drawer-side">
      <label
        htmlFor="drawer-toggle"
        onClick={() => setCurrentTab("Dashboard")}
        className="drawer-overlay"
      ></label>
      <aside className="bg-base-200 w-80 h-full">
        <div className="navbar bg-base-200 border-b">
          <div className="flex-1 px-4">
            <div className="flex items-center gap-2">
              <FaComments size={24} className="text-primary" />
              <span className="text-xl font-bold">BaatCheet</span>
            </div>
          </div>
        </div>

        <ul className="menu p-4 text-base-content">
          <li>
            <label
              htmlFor="drawer-toggle"
              onClick={() => setCurrentTab("Dashboard")}
              className={`${currentTab == "Dashboard" ? "active" : ""}`}
            >
              <FaHome size={18} />
              Dashboard
            </label>
          </li>
          <li>
            <label
              htmlFor="drawer-toggle"
              onClick={() => setCurrentTab("Users")}
              className={`${currentTab == "Users" ? "active" : ""}`}
            >
              <FaUser size={18} />
              Users
              {/* <span className="badge badge-sm">{groups.length}</span> */}
            </label>
          </li>
          <li>
            <label
              htmlFor="drawer-toggle"
              onClick={() => setCurrentTab("Groups")}
              className={`${currentTab == "Groups" ? "active" : ""}`}
            >
              <FaUsers size={18} />
              Groups
              {/* <span className="badge badge-sm">{groups.length}</span> */}
            </label>
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
      </aside>
    </div>
  );
};

export default Sidebar;
