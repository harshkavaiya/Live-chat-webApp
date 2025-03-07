"use client"

import { useState } from "react"
import {
  FaBell,
  FaChevronDown,
  FaFilter,
  FaHome,
  FaSignOutAlt,
  FaComments,
  FaEllipsisV,
  FaPlus,
  FaSearch,
  FaCog,
  FaUsers,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaUserCog,
  FaUserMinus,
  FaBan,
} from "react-icons/fa"

// Mock data for groups
const groups = [
  {
    id: 1,
    name: "Organic Gardening",
    image: "/placeholder.svg?height=80&width=80",
    category: "Organic",
    members: 128,
    createdDate: "2023-05-15",
    status: "active",
    description: "A group for sharing organic gardening tips and experiences.",
    createdBy: "John Doe",
    type: "Public",
    rules: "Be respectful. No spam. Share valuable content only.",
  },
  {
    id: 2,
    name: "Healthy Recipes",
    image: "/placeholder.svg?height=80&width=80",
    category: "Health",
    members: 256,
    createdDate: "2023-04-10",
    status: "active",
    description: "Share your favorite healthy recipes and cooking tips.",
    createdBy: "Jane Smith",
    type: "Public",
    rules: "Only share healthy recipes. No promotion of fad diets.",
  },
  {
    id: 3,
    name: "Local Food Market",
    image: "/placeholder.svg?height=80&width=80",
    category: "Food",
    members: 89,
    createdDate: "2023-06-22",
    status: "inactive",
    description: "Updates about local farmers markets and food events.",
    createdBy: "Mike Johnson",
    type: "Private",
    rules: "Local businesses only. No national chains.",
  },
  {
    id: 4,
    name: "Fitness Enthusiasts",
    image: "/placeholder.svg?height=80&width=80",
    category: "Health",
    members: 312,
    createdDate: "2023-03-05",
    status: "active",
    description: "For people passionate about fitness and healthy living.",
    createdBy: "Sarah Williams",
    type: "Public",
    rules: "Be supportive. No body shaming. Share your journey.",
  },
  {
    id: 5,
    name: "Sustainable Living",
    image: "/placeholder.svg?height=80&width=80",
    category: "Organic",
    members: 175,
    createdDate: "2023-07-01",
    status: "active",
    description: "Tips and discussions about sustainable living practices.",
    createdBy: "Alex Green",
    type: "Public",
    rules: "Focus on sustainability. Be constructive in discussions.",
  },
  {
    id: 6,
    name: "Vegan Cooking",
    image: "/placeholder.svg?height=80&width=80",
    category: "Food",
    members: 142,
    createdDate: "2023-05-28",
    status: "active",
    description: "Sharing vegan recipes and cooking techniques.",
    createdBy: "Emma Brown",
    type: "Public",
    rules: "Vegan recipes only. Be respectful of dietary choices.",
  },
]

// Mock data for members
const members = [
  { id: 1, name: "John Doe", email: "john@example.com", joinDate: "2023-05-15", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", joinDate: "2023-05-16", role: "Member" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", joinDate: "2023-05-17", role: "Member" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", joinDate: "2023-05-18", role: "Member" },
  { id: 5, name: "Alex Green", email: "alex@example.com", joinDate: "2023-05-19", role: "Member" },
]

// Mock data for recent activity
const recentActivity = [
  { id: 1, user: "John Doe", content: "Shared a new organic gardening tip", time: "2 hours ago" },
  { id: 2, user: "Jane Smith", content: "Posted a photo of her garden", time: "5 hours ago" },
  { id: 3, user: "Mike Johnson", content: "Asked a question about composting", time: "1 day ago" },
  { id: 4, user: "Sarah Williams", content: "Shared an article about organic pesticides", time: "2 days ago" },
]

// Mock data for join requests
const joinRequests = [
  { id: 1, name: "Robert Brown", email: "robert@example.com", requestDate: "2023-07-10" },
  { id: 2, name: "Emily White", email: "emily@example.com", requestDate: "2023-07-09" },
]

export default function AdminPanel() {
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [activeTab, setActiveTab] = useState("about")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Filter groups based on search query
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort groups based on selected option
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    } else if (sortBy === "members") {
      return b.members - a.members
    } else if (sortBy === "active") {
      return a.status === "active" ? -1 : 1
    }
    return 0
  })

  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId)
    setActiveTab("about")
  }

  const handleBackToListing = () => {
    setSelectedGroup(null)
  }

  const selectedGroupData = groups.find((group) => group.id === selectedGroup)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        onChange={toggleSidebar}
      />

      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-100 border-b shadow-sm">
          <div className="navbar-start">
            <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost drawer-button lg:hidden">
              <FaComments size={20} />
            </label>
            <div className="flex-1 px-2 mx-2 lg:hidden">
              <span className="text-lg font-bold">GroupAdmin</span>
            </div>
          </div>
          <div className="navbar-center hidden lg:flex">
            <div className="form-control">
              <div className="input-group">
                <span className="btn btn-square btn-ghost">
                  <FaSearch size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search groups..."
                  className="input input-bordered w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                  <img src="/placeholder-user.jpg" width={40} height={40} alt="User" />
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

        {/* Mobile Search */}
        <div className="p-4 lg:hidden">
          <div className="form-control">
            <div className="input-group">
              <span className="btn btn-square btn-ghost">
                <FaSearch size={16} />
              </span>
              <input
                type="text"
                placeholder="Search groups..."
                className="input input-bordered w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          {selectedGroup === null ? (
            // Group Listing Page
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Groups</h1>
                  <p className="text-base-content/70 mt-1">Manage all your groups from one place</p>
                </div>
                <button className="btn btn-primary mt-4 md:mt-0">
                  <FaPlus className="mr-2" size={16} />
                  Create Group
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <select
                    className="select select-bordered w-full sm:w-auto"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="members">Most Members</option>
                    <option value="active">Active Groups</option>
                  </select>
                  <button className="btn btn-ghost">
                    <FaFilter size={16} />
                    <span className="ml-2">Filter</span>
                  </button>
                </div>
                <div className="text-sm text-base-content/70">
                  Showing {sortedGroups.length} of {groups.length} groups
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedGroups.map((group) => (
                  <div
                    key={group.id}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  >
                    <figure className="relative h-40">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <img src={group.image || "/placeholder.svg"} alt={group.name} fill className="object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white">{group.name}</h3>
                      </div>
                    </figure>
                    <div className="card-body p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="badge badge-outline">{group.category}</div>
                        <div className={`badge ${group.status === "active" ? "badge-success" : "badge-warning"}`}>
                          {group.status === "active" ? "Active" : "Inactive"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-base-content/70 mb-1">
                        <FaUsers size={14} />
                        <span>{group.members} members</span>
                      </div>

                      <div className="text-sm text-base-content/70">
                        Created: {new Date(group.createdDate).toLocaleDateString()}
                      </div>

                      <div className="card-actions justify-between mt-4">
                        <button className="btn btn-primary btn-sm" onClick={() => handleGroupSelect(group.id)}>
                          View Details
                        </button>
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                            <FaEllipsisV size={16} />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                          >
                            <li>
                              <a>
                                <FaEdit className="mr-2" size={14} />
                                Edit Group
                              </a>
                            </li>
                            <li>
                              <a>
                                <FaUsers className="mr-2" size={14} />
                                Export Members
                              </a>
                            </li>
                            <li>
                              <a className="text-error">
                                <FaTrash className="mr-2" size={14} />
                                Delete Group
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Group Details Page
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
                <button className="btn btn-outline btn-sm" onClick={handleBackToListing}>
                  &larr; Back to Groups
                </button>
                <h1 className="text-2xl font-bold mt-2 sm:mt-0">{selectedGroupData?.name}</h1>
                <div
                  className={`badge ${selectedGroupData?.status === "active" ? "badge-success" : "badge-warning"} ml-2`}
                >
                  {selectedGroupData?.status === "active" ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Group Info Card */}
                <div className="lg:col-span-1">
                  <div className="card bg-base-100 shadow-xl">
                    <figure className="px-6 pt-6">
                      <div className="avatar">
                        <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img
                            src={selectedGroupData?.image || "/placeholder.svg"}
                            alt={selectedGroupData?.name}
                            width={128}
                            height={128}
                          />
                        </div>
                      </div>
                    </figure>
                    <div className="card-body items-center text-center">
                      <h2 className="card-title text-2xl">{selectedGroupData?.name}</h2>
                      <div className="badge badge-primary badge-outline">{selectedGroupData?.category}</div>

                      <div className="stats shadow mt-4 w-full">
                        <div className="stat place-items-center">
                          <div className="stat-title">Members</div>
                          <div className="stat-value text-primary">{selectedGroupData?.members}</div>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <div className="w-full">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="font-semibold text-left">Created By:</div>
                          <div className="text-right">{selectedGroupData?.createdBy}</div>

                          <div className="font-semibold text-left">Created Date:</div>
                          <div className="text-right">
                            {new Date(selectedGroupData?.createdDate).toLocaleDateString()}
                          </div>

                          <div className="font-semibold text-left">Group Type:</div>
                          <div className="text-right">{selectedGroupData?.type}</div>
                        </div>
                      </div>

                      <div className="card-actions justify-between w-full mt-6">
                        <button className="btn btn-outline">
                          <FaEdit className="mr-2" size={16} />
                          Edit
                        </button>
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="btn btn-ghost">
                            More
                            <FaChevronDown className="ml-2" size={14} />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                          >
                            <li>
                              <a>
                                <FaUsers className="mr-2" size={14} />
                                Export Members
                              </a>
                            </li>
                            <li>
                              <a>
                                <FaEdit className="mr-2" size={14} />
                                Archive Group
                              </a>
                            </li>
                            <li>
                              <a className="text-error">
                                <FaTrash className="mr-2" size={14} />
                                Delete Group
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs Content */}
                <div className="lg:col-span-2">
                  <div className="tabs tabs-boxed mb-6">
                    <a
                      className={`tab ${activeTab === "about" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("about")}
                    >
                      About
                    </a>
                    <a
                      className={`tab ${activeTab === "members" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("members")}
                    >
                      Members
                    </a>
                    <a
                      className={`tab ${activeTab === "activity" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("activity")}
                    >
                      Activity
                    </a>
                    <a
                      className={`tab ${activeTab === "requests" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("requests")}
                    >
                      Requests
                    </a>
                  </div>

                  {/* About Tab */}
                  {activeTab === "about" && (
                    <div className="space-y-6">
                      <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h3 className="card-title">Description</h3>
                          <p className="mt-2">{selectedGroupData?.description}</p>
                        </div>
                      </div>

                      <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h3 className="card-title">Rules & Guidelines</h3>
                          <p className="mt-2">{selectedGroupData?.rules}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Members Tab */}
                  {activeTab === "members" && (
                    <div className="card bg-base-100 shadow-xl">
                      <div className="card-body">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <h3 className="card-title">Members ({members.length})</h3>
                          <div className="flex items-center gap-2">
                            <div className="form-control">
                              <div className="input-group">
                                <input
                                  type="text"
                                  placeholder="Search members..."
                                  className="input input-bordered w-full sm:w-auto"
                                />
                                <button className="btn btn-square">
                                  <FaSearch size={16} />
                                </button>
                              </div>
                            </div>
                            <button className="btn btn-primary">
                              <FaUserPlus className="mr-2" size={16} />
                              Add
                            </button>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="table table-zebra w-full">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Join Date</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {members.map((member) => (
                                <tr key={member.id}>
                                  <td>
                                    <div className="flex items-center space-x-3">
                                      <div className="avatar">
                                        <div className="mask mask-squircle w-10 h-10">
                                          <img src="/placeholder-user.jpg" alt={member.name} width={40} height={40} />
                                        </div>
                                      </div>
                                      <div>
                                        <div className="font-bold">{member.name}</div>
                                        {member.role === "Admin" && (
                                          <div className="badge badge-primary badge-sm">Admin</div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td>{member.email}</td>
                                  <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                                  <td>
                                    <div className="dropdown dropdown-end">
                                      <label tabIndex={0} className="btn btn-ghost btn-xs">
                                        Actions
                                        <FaChevronDown className="ml-1" size={12} />
                                      </label>
                                      <ul
                                        tabIndex={0}
                                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                      >
                                        {member.role !== "Admin" && (
                                          <li>
                                            <a>
                                              <FaUserCog className="mr-2" size={14} />
                                              Promote to Admin
                                            </a>
                                          </li>
                                        )}
                                        <li>
                                          <a>
                                            <FaComments className="mr-2" size={14} />
                                            Message
                                          </a>
                                        </li>
                                        <li>
                                          <a>
                                            <FaUserMinus className="mr-2" size={14} />
                                            Remove from Group
                                          </a>
                                        </li>
                                        <li>
                                          <a className="text-error">
                                            <FaBan className="mr-2" size={14} />
                                            Block User
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity Tab */}
                  {activeTab === "activity" && (
                    <div className="card bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h3 className="card-title mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                          {recentActivity.map((activity) => (
                            <div key={activity.id} className="bg-base-200 rounded-lg p-4">
                              <div className="flex items-start gap-4">
                                <div className="avatar">
                                  <div className="w-12 h-12 rounded-full">
                                    <img src="/placeholder-user.jpg" alt={activity.user} width={48} height={48} />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-bold">{activity.user}</h4>
                                    <span className="text-xs text-base-content/70">{activity.time}</span>
                                  </div>
                                  <p className="mt-1">{activity.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Requests Tab */}
                  {activeTab === "requests" && (
                    <div className="card bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h3 className="card-title mb-4">Join Requests ({joinRequests.length})</h3>

                        {joinRequests.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Email</th>
                                  <th>Request Date</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {joinRequests.map((request) => (
                                  <tr key={request.id}>
                                    <td>
                                      <div className="flex items-center space-x-3">
                                        <div className="avatar">
                                          <div className="mask mask-squircle w-10 h-10">
                                            <img
                                              src="/placeholder-user.jpg"
                                              alt={request.name}
                                              width={40}
                                              height={40}
                                            />
                                          </div>
                                        </div>
                                        <div className="font-bold">{request.name}</div>
                                      </div>
                                    </td>
                                    <td>{request.email}</td>
                                    <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                                    <td>
                                      <div className="flex space-x-2">
                                        <button className="btn btn-success btn-sm">Approve</button>
                                        <button className="btn btn-error btn-sm">Reject</button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="alert alert-info">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              className="stroke-current shrink-0 w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            <span>No pending join requests at this time.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
        <aside className="bg-base-200 w-80 h-full">
          <div className="navbar bg-base-200 border-b">
            <div className="flex-1 px-4">
              <div className="flex items-center gap-2">
                <FaComments size={24} className="text-primary" />
                <span className="text-xl font-bold">GroupAdmin</span>
              </div>
            </div>
          </div>

          <ul className="menu p-4 text-base-content">
            <li>
              <a className="active">
                <FaHome size={18} />
                Dashboard
              </a>
            </li>
            <li>
              <a>
                <FaUsers size={18} />
                Groups
                <span className="badge badge-sm">{groups.length}</span>
              </a>
            </li>
            <li>
              <a>
                <FaCog size={18} />
                Settings
              </a>
            </li>
          </ul>

          <div className="absolute bottom-0 w-full border-t p-4">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src="/placeholder-user.jpg" width={48} height={48} alt="User" />
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
    </div>
  )
}

