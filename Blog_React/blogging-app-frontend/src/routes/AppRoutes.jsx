import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import ProtectedRoute from "../components/comman/ProtectedRoute";
import ReadBlog from "../pages/ReadBlog";
import ReportBlog from "../pages/ReportBlog";
import WriteBlog from "../pages/WriteBlog";
import UserProfile from "../pages/UserProfile";

/* 🔽 NEW IMPORTS – DOES NOT AFFECT EXISTING FLOW */
import ResetA from "../pages/ResetA";
import ResetB from "../pages/ResetB";
import Contact from "../pages/Contact";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔽 FORGOT PASSWORD FLOW (PUBLIC) */}
      <Route path="/reset-a" element={<ResetA />} />
      <Route path="/reset-b" element={<ResetB />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/read-blog/:id" element={<ReadBlog />} />
      <Route path="/report/:id" element={<ReportBlog />} />
      <Route path="/create-blog" element={<WriteBlog />} />
      <Route path="/user" element={<UserProfile />} />
      <Route path="/admin" element={<Admin />} />

      {/* PROTECTED */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
