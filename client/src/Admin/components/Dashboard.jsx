import { FaEllipsisV, FaUser, FaUsers } from "react-icons/fa";
import useUsersStore from "../store/useUsersStore";
import useGroupStore from "../store/useGroupStore";
import { calculateIncrease } from "../function/function";

const Dashboard = () => {
  const { users, thisMonthUser } = useUsersStore();
  const { groups, thisMonthGroup } = useGroupStore();
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Total Likes */}
        <StatCard
          title="Total Users"
          value={users.length}
          thisMonth={thisMonthUser}
          icon={<FaUser className="text-white text-2xl" />}
          color="from-purple-500 to-indigo-600"
        />

        {/* Page Views */}
        <StatCard
          title="Total Groups"
          value={groups.length}
          thisMonth={thisMonthGroup}
          change="+21%"
          icon={<FaUsers className="text-white text-2xl" />}
          color="from-pink-500 to-rose-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="card bg-white shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Activity
            </h2>
            <button className="btn btn-ghost btn-sm btn-circle">
              <FaEllipsisV className="text-gray-500" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="bg-gray-50">User</th>
                  <th className="bg-gray-50">Activity</th>
                  <th className="bg-gray-50">Date</th>
                  <th className="bg-gray-50">Status</th>
                  <th className="bg-gray-50">Action</th>
                </tr>
              </thead>
              <tbody>
                <ActivityRow
                  name="John Doe"
                  location="United States"
                  activity="Created a new post"
                  date="Today, 2:30 PM"
                  status="completed"
                />
                <ActivityRow
                  name="Jane Smith"
                  location="Canada"
                  activity="Updated profile"
                  date="Yesterday, 5:15 PM"
                  status="in-progress"
                />
                <ActivityRow
                  name="Robert Johnson"
                  location="United Kingdom"
                  activity="Joined group"
                  date="Mar 15, 2023"
                  status="pending"
                />
                <ActivityRow
                  name="Emily Davis"
                  location="Australia"
                  activity="Uploaded files"
                  date="Mar 12, 2023"
                  status="completed"
                />
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6">
            {/* <button className="btn btn-outline btn-primary">
              View All Activities
            </button> */}
          </div>
        </div>
      </div>
    </main>
  );
};

function StatCard({ title, value, thisMonth, icon, color }) {
  return (
    <div className="card bg-white shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
      <div className="card-body p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-gray-500 font-medium">{title}</h2>
            <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
              {value}
            </p>
            <p className="text-green-500 text-sm mt-1">
              {calculateIncrease(value, thisMonth)} more than last month
            </p>
          </div>
          <div className={`bg-gradient-to-r ${color} p-3 rounded-lg shadow-lg`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ name, location, activity, date, status }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="badge badge-sm bg-green-100 text-green-800 border-0 px-3 py-2">
            Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="badge badge-sm bg-blue-100 text-blue-800 border-0 px-3 py-2">
            In Progress
          </span>
        );
      case "pending":
        return (
          <span className="badge badge-sm bg-yellow-100 text-yellow-800 border-0 px-3 py-2">
            Pending
          </span>
        );
      default:
        return (
          <span className="badge badge-sm bg-gray-100 text-gray-800 border-0 px-3 py-2">
            {status}
          </span>
        );
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img src="/placeholder.svg?height=48&width=48" alt="Avatar" />
            </div>
          </div>
          <div>
            <div className="font-bold text-gray-800">{name}</div>
            <div className="text-sm text-gray-500">{location}</div>
          </div>
        </div>
      </td>
      <td className="text-gray-700">{activity}</td>
      <td className="text-gray-500">{date}</td>
      <td>{getStatusBadge(status)}</td>
      <td>
        <button className="btn btn-ghost btn-xs">Details</button>
      </td>
    </tr>
  );
}

export default Dashboard;
