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
      </div>
    </>
  );
};

export default Navbar;
