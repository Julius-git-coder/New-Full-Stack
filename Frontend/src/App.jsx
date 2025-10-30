import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import { userAPI } from "./services/api";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LogOut } from "lucide-react";

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Load users on mount if authenticated
  useEffect(() => {
    if (user) {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await userAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      alert("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogout = () => {
    logout();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={
            user ? (
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-8">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="text-center flex-1">
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        User Management System
                      </h1>
                      <p className="text-gray-600">
                        Create, manage, and organize user profiles with file
                        uploads
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
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
                        loading={loadingUsers}
                        onRefresh={loadUsers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
