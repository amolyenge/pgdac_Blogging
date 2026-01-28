import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import logo from "../assets/logo.png";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const rules = [
      /.{8,10}/,          // 8–10 chars
      /[A-Z]/,            // uppercase
      /[a-z]/,            // lowercase
      /[^A-Za-z0-9]/,     // symbol
    ];
    return rules.every((rule) => rule.test(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password must be same");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password does not meet the required rules");
      return;
    }

    try {
      await registerUser(form);

      setSuccess("Registered successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login", {
          state: { message: "Registration successful. Please login." },
        });
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      {/* HEADER */}
      <header className="register-header">
        <div className="logo-section">
          <img src={logo} alt="BlogVerse" className="logo-img" />
          <span className="brand-name">BlogVerse</span>
        </div>
        <div className="header-text">Create Your BlogVerse Account</div>
      </header>

      {/* CONTENT */}
      <div className="register-content">
        {/* FORM */}
        <div className="register-card">
          <h2 className="register-quote">
            “Start your blogging journey today.”
          </h2>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input name="username" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="register-btn">
              Register
            </button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>

        {/* PASSWORD RULES */}
        <div className="password-rules">
          <h4>Password Rules</h4>
          <ul>
            <li>1) Password should be 8–10 characters</li>
            <li>2) At least 1 Uppercase</li>
            <li>3) At least 1 Lowercase</li>
            <li>4) At least 1 Symbol</li>
            <li>5) Likewise Other if any</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
