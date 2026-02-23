import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  ShieldCheck,
  ArrowUpDown,
  Download,
  Filter,
  X,
} from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";
import StatCard from "../../components/common/StatCard";
import toast from "react-hot-toast";
import { exportToCSV } from "../../utils/exportToCSV";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEmployees: 0,
    pendingApprovals: 0,
  });

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
    try {
      const response = await api.put(`/users/${id}/role`, { role: newRole });
      if (response.data.success) {
        toast.success("User role updated");
        setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await api.delete(`/users/${id}`);
      if (response.data.success) {
        toast.success("User deleted");
        setUsers(users.filter((u) => u._id !== id));
        // Update stats
        setStats((prev) => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
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
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">User Management</h1>
          <p className="text-gray-500 font-medium">
            Manage employee accounts, roles, and system access.
          </p>
        </div>
        <Button
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center gap-2 px-6 shadow-blue-100"
        >
          <UserPlus size={18} /> Add New User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Directory" value={stats.totalUsers} icon={Users} color="blue" />
        <StatCard
          title="Active Staff"
          value={stats.activeEmployees}
          icon={ShieldCheck}
          color="green"
        />
        <StatCard
          title="Pending Ops"
          value={stats.pendingApprovals}
          icon={ArrowUpDown}
          color="orange"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Find users by name, email or ID..."
              className="w-full bg-gray-50 border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="p-2 border-gray-100 text-gray-400 hover:text-gray-600"
            >
              <Filter size={18} />
            </Button>
            <Button
              variant="outline"
              className="p-2 border-gray-100 text-gray-400 hover:text-gray-600"
              onClick={() => exportToCSV(filteredUsers, "system_users")}
            >
              <Download size={18} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/20">
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Employee Profile
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Contact Info
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Access Role
                </th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                          {u.employeeId || "NO-ID"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-600">{u.email}</td>
                  <td className="px-6 py-5">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button
                      variant="secondary"
                      className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 border border-gray-100"
                      onClick={() => handleDelete(u._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-gray-50">
          <p className="text-xs text-center text-gray-400 font-bold uppercase tracking-widest">
            End of Directory
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
