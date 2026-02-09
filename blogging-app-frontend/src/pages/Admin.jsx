import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosInstance from "../api/axiosInstance";
import "./Admin.css";

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("");
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);

  // Load all reports
  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Load all users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Search users by username
  const searchUsers = async () => {
    if (!userSearch.trim()) {
      loadUsers();
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/admin/users/search/${userSearch.trim()}`
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error searching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);

    if (tab === "complaints") loadReports();
    if (tab === "seeUsers") loadUsers();
    if (tab === "removeUser") {
      setUsers([]); // reset
    }
  };

  // Toggle report resolved
  const handleToggleReport = async (report) => {
    try {
      const res = await axiosInstance.put(
        `/reports/${report.id}/toggle-resolve`
      );

      alert(res.data.message);

      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, isResolved: !r.isResolved } : r
        )
      );
    } catch (err) {
      console.error("Error toggling report:", err);
      alert("Failed to update report status");
    }
  };

  // Block / Unblock user
  const handleToggleBlock = async (user) => {
    try {
      const res = await axiosInstance.put(
        `/admin/users/${user.id}/toggle-block`
      );

      alert(res.data);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
    } catch (err) {
      console.error("Error toggling user block:", err);
      alert("Failed to toggle user block");
    }
  };

  // Remove user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setUserIdToDelete("");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  return (
    <>
      <Header setMode={() => {}} setCategory={() => {}} />

      <div className="admin-page">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <h3>Admin Panel</h3>
          <p className="admin-email">admin@gmail.com</p>

          <button
            className={selectedTab === "complaints" ? "active" : ""}
            onClick={() => handleTabClick("complaints")}
          >
            Complaints
          </button>

          <button
            className={selectedTab === "seeUsers" ? "active" : ""}
            onClick={() => handleTabClick("seeUsers")}
          >
            See Users
          </button>

          <button
            className={selectedTab === "removeUser" ? "active" : ""}
            onClick={() => handleTabClick("removeUser")}
          >
            Remove User
          </button>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          {/* Default text */}
          {selectedTab === "" && (
            <p>Select an option from the left to show content</p>
          )}

          {/* Complaints */}
          {selectedTab === "complaints" && (
            <>
              <h2>Reported Complaints</h2>

              {loading && <p className="status">Loading reports...</p>}
              {!loading && reports.length === 0 && (
                <p className="status">No reports to show.</p>
              )}

              {!loading &&
                reports
                  .sort((a, b) =>
                    a.isResolved === b.isResolved ? 0 : a.isResolved ? 1 : -1
                  )
                  .map((r) => (
                    <div
                      key={r.id}
                      className={`report-card ${
                        r.isResolved ? "resolved" : ""
                      }`}
                    >
                      <p>
                        <strong>Report ID:</strong> {r.id}
                      </p>

                      <p>
                        <strong>Blog ID:</strong> {r.blog?.id} <br />
                        <strong>Title:</strong> {r.blog?.title}
                      </p>

                      <p>
                        <strong>Reported By:</strong> {r.reportedBy}
                      </p>

                      <p>
                        <strong>Reason:</strong> {r.reason}
                      </p>

                      <p>
                        <strong>Reported At:</strong>{" "}
                        {new Date(r.reportedAt).toLocaleString()}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        {r.isResolved ? "Resolved" : "Unresolved"}
                      </p>

                      <button
                        className="btn-toggle-resolve"
                        onClick={() => handleToggleReport(r)}
                      >
                        {r.isResolved
                          ? "Mark as Unresolved"
                          : "Mark as Resolved"}
                      </button>
                    </div>
                  ))}
            </>
          )}

          {/* See Users */}
          {selectedTab === "seeUsers" && (
            <>
              <h2>User List</h2>

              <div className="search-users-bar">
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <button className="btn-search-user" onClick={searchUsers}>
                  Search
                </button>
              </div>

              {loading && <p className="status">Loading users...</p>}
              {!loading && users.length === 0 && (
                <p className="status">No users to show.</p>
              )}

              {!loading &&
                users.map((u) => (
                  <div key={u.id} className="user-card">
                    <p>
                      <strong>ID:</strong> {u.id}
                    </p>
                    <p>
                      <strong>Username:</strong> {u.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {u.email}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(u.createdAt).toLocaleString()}
                    </p>

                    <button
                      className="btn-toggle-block"
                      onClick={() => handleToggleBlock(u)}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                ))}
            </>
          )}

          {/* Remove User */}
          {selectedTab === "removeUser" && (
            <>
              <h2>Remove User</h2>

              <label>User ID to delete:</label>
              <input
                type="text"
                value={userIdToDelete}
                onChange={(e) => setUserIdToDelete(e.target.value)}
              />

              <button
                className="btn-delete-user"
                onClick={() => handleDeleteUser(userIdToDelete)}
              >
                Delete User
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Admin;
