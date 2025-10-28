import { useState, useEffect } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import { userAPI } from "./services/api";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = () => {
    loadUsers();
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await userAPI.deleteUser(userId);
      alert("User deleted successfully");
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            User Management System
          </h1>
          <p className="text-gray-600">
            Create, manage, and organize user profiles with file uploads
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Form */}
          <div>
            <UserForm
              onUserCreated={handleUserCreated}
              editingUser={editingUser}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          {/* User List */}
          <div>
            <UserList
              users={users}
              loading={loading}
              onRefresh={loadUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
