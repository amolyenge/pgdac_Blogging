import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Header.css";

const Header = ({ setMode, setCategory }) => {
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const categories = [
    "Technology",
    "Lifestyle",
    "Sports",
    "Religion And Traditions",
    "Business",
    "Healthcare",
  ];

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setMode("category");
  };

  const handleProfileClick = () => {
    const role = localStorage.getItem("role");
    if (role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/user"); // To implement user profile page later
    }
    setShowProfileMenu(false);
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/");
    setShowProfileMenu(false);
  };

  return (
    <header className="main-header">
      {/* Logo */}
      <div
        className="header-logo"
        onClick={() => {
          navigate("/home");
          setMode("all");
        }}
      >
        <img src={logo} alt="BlogVerse Logo" className="logo-img" />
        <span className="logo-text">BlogVerse</span>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <Link
          to="/home"
          onClick={() => {
            setMode("all");
          }}
        >
          Home
        </Link>

        <Link to="/create-blog">Write Blog</Link>

        <button className="nav-btn" onClick={() => setMode("trending")}>
          Trending
        </button>

        <div
          className="nav-dropdown"
          onMouseEnter={() => setShowCategoryMenu(true)}
          onMouseLeave={() => setShowCategoryMenu(false)}
        >
          <button className="nav-btn">Category ▼</button>

          {showCategoryMenu && (
            <div className="dropdown-content">
              {categories.map((cat) => (
                <p
                  key={cat}
                  className="dropdown-item"
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </p>
              ))}
            </div>
          )}
        </div>


        <div
          className="profile-circle"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        />
        {showProfileMenu && (
          <div className="profile-menu">
            <p className="profile-item" onClick={handleProfileClick}>
              Profile
            </p>
            <p className="profile-item" onClick={handleLogoutClick}>
              Logout
            </p>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
