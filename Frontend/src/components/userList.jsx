import { RefreshCw, Download, Edit2, Trash2, FileText } from "lucide-react";
import { userAPI } from "../services/api";

export default function UserList({
  users,
  loading,
  onRefresh,
  onEdit,
  onDelete,
}) {
  const handleDownload = (userId) => {
    const downloadUrl = userAPI.getDownloadUrl(userId);
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Users List</h2>
          <p className="text-sm text-gray-600 mt-1">
            {users.length} {users.length === 1 ? "user" : "users"} total
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* User List */}
      <div className="px-8 py-6">
        {loading && users.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No users found</p>
            <p className="text-gray-400 text-sm mt-1">
              Create your first user to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {user.file?.url && (
                        <img
                          src={user.file.url}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {(user.phone || user.address) && (
                      <div className="ml-15 space-y-1">
                        {user.phone && (
                          <p className="text-sm text-gray-600">
                            📞 {user.phone}
                          </p>
                        )}
                        {user.address && (
                          <p className="text-sm text-gray-600 truncate">
                            📍 {user.address}
                          </p>
                        )}
                      </div>
                    )}

                    {user.file && (
                      <div className="mt-2 ml-15">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                          <FileText className="w-3 h-3" />
                          {user.file.filename || "File attached"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {user.file && (
                      <button
                        onClick={() => handleDownload(user._id)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Edit user"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user._id)}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
