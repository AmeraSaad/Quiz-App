import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminPanal = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/v1/auth/users', { withCredentials: true });
      setUsers(res.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await axios.patch(`http://localhost:5000/api/v1/auth/users/${userId}/role`, { role: newRole }, { withCredentials: true });
      toast.success('Role updated successfully');
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
    setUpdatingId(null);
  };

  const handleDeleteUser = async (userId) => {
    setUpdatingId(userId);
    try {
      await axios.delete(`http://localhost:5000/api/v1/auth/users/${userId}`, { withCredentials: true });
      toast.success('User deleted successfully');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
    setUpdatingId(null);
  };

  if (loading) return <div className="p-8 text-center">Loading users...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Admin Panel - User Management</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Verified</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  <select
                    value={user.role}
                    disabled={updatingId === user._id || user.isAdmin}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </td>
                <td className="p-2 border">{user.isVerified ? 'Yes' : 'No'}</td>
                <td className="p-2 border">
                  {user.isAdmin ? (
                    <span className="text-indigo-600 font-semibold">Admin</span>
                  ) : updatingId === user._id ? (
                    <span className="text-gray-500">Updating...</span>
                  ) : (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={updatingId === user._id}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanal;
