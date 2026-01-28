import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import logo from "../assets/logo.png";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return false;
    }

    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    if (password.length < 3) {
      setError("Password must be at least 3 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    try {
      const response = await loginUser({
        email,
        password,
      });

      const { token, role } = response.data;

      // Save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Role-based redirect
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home"); // USER
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <div className="logo-section">
          <img src={logo} alt="BlogVerse" className="logo-img" />
          <span className="brand-name">BlogVerse</span>
        </div>
        <div className="header-text">Welcome Back to BlogVerse</div>
      </header>

      <div className="login-wrapper">
        <div className="login-card">
          <h2 className="login-quote">
            “Log in to continue your blogging journey.”
          </h2>

          {error && <p className="error-text">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn">
              Log in
            </button>
          </form>

          <div className="login-links">
            <p>
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
            <p>
              Forgot password? <Link to="/reset-a">Reset</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
