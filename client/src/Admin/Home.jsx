import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Users from "./components/User";
import Groups from "./components/Group";
import Navbar from "./components/Navbar";
import useHomeStore from "./store/useHomeStore";
import useGroupStore from "./store/useGroupStore";
import useUsersStore from "./store/useUsersStore";

export default function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { fetchGroups } = useGroupStore();
  const { fetchUsers } = useUsersStore();
  const { currentTab } = useHomeStore();

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderTab = () => {
    switch (currentTab) {
      case "Dashboard":
        return <Dashboard />;

      case "Users":
        return <Users />;

      case "Groups":
        return <Groups />;
      default:
        break;
    }
  };
  return (
    <div data-theme="light" className="drawer lg:drawer-open">
      <input
        id="drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        onChange={toggleSidebar}
      />

      <div className="drawer-content flex flex-col h-full">
        <Navbar />
        {renderTab()}
      </div>
      {/* Sidebar */}
      <Sidebar />
    </div>
  );
}
