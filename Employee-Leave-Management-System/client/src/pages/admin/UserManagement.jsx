import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  ShieldCheck,
  ArrowUpDown,
  Download,
  X,
} from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";
import StatCard from "../../components/common/StatCard";
import toast from "react-hot-toast";
import { exportToCSV } from "../../utils/exportToCSV";
import { useNotifications } from "../../context/NotificationsContext";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEmployees: 0,
    pendingApprovals: 0,
  });
  const { addNotification } = useNotifications();

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    employeeId: "",
    role: "Employee",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          api.get("/users"),
          api.get("/users/stats"),
        ]);

        if (usersRes.data.success) setUsers(usersRes.data.users);
        if (statsRes.data.success) setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Could not load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    const target = users.find((u) => u._id === id);
    try {
      const response = await api.put(`/users/${id}/role`, { role: newRole });
      if (response.data.success) {
        toast.success("User role updated");
        setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
        addNotification({
          title: "Role Updated",
          message: `${target?.name ?? "User"}'s role has been changed to ${newRole}.`,
          type: "info",
        });
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    const target = users.find((u) => u._id === id);
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await api.delete(`/users/${id}`);
      if (response.data.success) {
        toast.success("User deleted");
        setUsers(users.filter((u) => u._id !== id));
        setStats((prev) => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
        addNotification({
          title: "User Removed",
          message: `${target?.name ?? "A user"} (${target?.employeeId ?? ""}) has been removed from the system.`,
          type: "reject",
        });
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/register", newUserForm);
      if (response.data.success) {
        toast.success("User created successfully");
        setIsAddUserModalOpen(false);
        // Reset form
        setNewUserForm({
          name: "",
          email: "",
          password: "",
          department: "",
          employeeId: "",
          role: "Employee",
        });

        // Refresh users list gently
        const newUsersRes = await api.get("/users");
        if (newUsersRes.data.success) {
          setUsers(newUsersRes.data.users);
          setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex bg-white rounded-2xl p-12 items-center justify-center animate-pulse font-black text-gray-400">
        Loading User Directory...
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Company Directory</h1>
          <p className="text-gray-500 font-medium">
            Manage employee accounts, roles, and system access levels.
          </p>
        </div>
        <Button
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center gap-2 px-6 shadow-blue-200 shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
        >
          <UserPlus size={18} /> Add New Member
        </Button>
      </div>

      {/* Main Data Grid Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[500px]">
        {/* Toolbar Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-shadow font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="px-4 py-2.5 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 bg-white"
              onClick={() => {
                exportToCSV(filteredUsers, "system_users");
                addNotification({
                  title: "Data Exported",
                  message: `${filteredUsers.length} user records exported to system_users.csv.`,
                  type: "info",
                });
              }}
            >
              <Download size={18} className="mr-2 inline" /> Export
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto flex-1 bg-white">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  User Profile
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  System Role
                </th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right bg-gray-50/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center text-zinc-700 font-bold border border-blue-200 shadow-sm group-hover:scale-105 transition-transform">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{u.name}</div>
                          <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">
                            {u.employeeId || "NO-ID"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-600 truncate max-w-[200px]">
                        {u.email}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        Department: {u.department || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className={`border rounded-lg py-1.5 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          u.role === "Admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : u.role === "Manager"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="p-2 inline-flex items-center justify-center bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-lg transition-colors shadow-sm"
                        onClick={() => handleDelete(u._id)}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-gray-500 font-medium">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Search size={32} className="text-gray-300" />
                      <p>No users found matching your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
          <p className="text-xs text-gray-500 font-bold">
            Showing <span className="text-gray-900">{filteredUsers.length}</span> of {users.length}{" "}
            users
          </p>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsAddUserModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-gray-900 mb-6">Add New User</h3>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newUserForm.department}
                    onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newUserForm.employeeId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, employeeId: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Role *</label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
