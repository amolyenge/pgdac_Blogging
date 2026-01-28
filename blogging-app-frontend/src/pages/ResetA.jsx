import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import logo from "../assets/logo.png";
import "./ResetA.css";

const ResetA = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    setMsg("");
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      await forgotPassword(email);
      setMsg("OTP sent to email");

      setTimeout(() => {
        navigate("/reset-b", { state: { email } });
      }, 1200);
    } catch {
      setError("Failed to send OTP");
    }
  };

  return (
    <div className="reset-container">
      <header className="reset-header">
        <img src={logo} className="logo-img" />
        <h3>Recover Your Account</h3>
      </header>

      <div className="reset-card">
        <label>Enter Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        {error && <p className="error">{error}</p>}
        {msg && <p className="success">{msg}</p>}

        <button onClick={handleNext}>Next</button>

        <div className="links">
          <Link to="/login">← Back to Login</Link>
          <Link to="/contact">Need Help ? Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetA;
