import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosInstance from "../api/axiosInstance";
import "./Admin.css";

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("");
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);

  // Load complaints
  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load users
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

  const handleTabClick = (tab) => {
    setSelectedTab(tab);

    if (tab === "complaints") loadReports();
    if (tab === "seeUsers") loadUsers();
  };

  // Delete report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await axiosInstance.delete(`/reports/${reportId}`);
      setReports(reports.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setUserIdToDelete("");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <>
      <Header setMode={() => {}} setCategory={() => {}} />

      <div className="admin-page">
        {/* Left Sidebar */}
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

        {/* Right Content */}
        <div className="admin-content">
          {selectedTab === "" && (
            <p>Select an option from the left to show content</p>
          )}

          {/* ================= COMPLAINTS ================= */}
          {selectedTab === "complaints" && (
            <>
              <h2>Reported Complaints</h2>

              {loading && <p>Loading reports...</p>}
              {!loading && reports.length === 0 && (
                <p>No complaints to show.</p>
              )}

              {reports.map((r) => (
                <div key={r.id} className="report-card">
                  <p>
                    <strong>Report ID:</strong> {r.id}
                  </p>
                  <p>
                    <strong>Blog ID:</strong> {r.blogId}
                  </p>
                  <p>
                    <strong>Reason:</strong> {r.reason}
                  </p>

                  <button
                    className="btn-delete-report"
                    onClick={() => handleDeleteReport(r.id)}
                  >
                    Delete Report
                  </button>
                </div>
              ))}
            </>
          )}

          {/* ================= SEE USERS ================= */}
          {selectedTab === "seeUsers" && (
            <>
              <h2>User List</h2>

              {loading && <p>Loading users...</p>}
              {!loading && users.length === 0 && (
                <p>No users to show.</p>
              )}

              {users.map((u) => (
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
                    <strong>Created At:</strong> {new Date(u.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </>
          )}

          {/* ================= REMOVE USER ================= */}
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
