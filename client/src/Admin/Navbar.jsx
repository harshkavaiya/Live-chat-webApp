import { FaBell, FaComments } from "react-icons/fa";

const Navbar = () => {
  return (
    <>
      <div className="navbar bg-base-100 border-b shadow-sm">
        <div className="navbar-start">
          <label
            htmlFor="drawer-toggle"
            className="btn btn-square btn-ghost drawer-button lg:hidden"
          >
            <FaComments size={20} />
          </label>
          <div className="flex-1 px-2 mx-2 lg:hidden">
            <span className="text-lg font-bold">BaatCheet</span>
          </div>
        </div>

        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <FaBell size={18} />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src="/placeholder-user.jpg"
                  width={40}
                  height={40}
                  alt="User"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
