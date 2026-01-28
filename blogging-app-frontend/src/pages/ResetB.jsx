import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import logo from "../assets/logo.png";
import "./ResetB.css";

const ResetB = () => {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validatePassword = (p) =>
    /.{8,10}/.test(p) &&
    /[A-Z]/.test(p) &&
    /[a-z]/.test(p) &&
    /[^A-Za-z0-9]/.test(p);

  const handleUpdate = async () => {
    setError("");
    setMsg("");

    if (!validatePassword(form.newPassword)) {
      setError("Password does not meet rules");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        email,
        otp: form.otp,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setMsg("Password updated successfully");

      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setError("Invalid or expired OTP");
    }
  };

  return (
    <div className="resetb-container">
      <header className="reset-header">
        <img src={logo} className="logo-img" />
        <h3>Change Your Credentials</h3>
      </header>

      <div className="resetb-content">
        <div className="resetb-form">
          <input name="newPassword" placeholder="New Password" onChange={handleChange} />
          <input name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
          <input name="otp" placeholder="OTP" onChange={handleChange} />

          {error && <p className="error">{error}</p>}
          {msg && <p className="success">{msg}</p>}

          <button onClick={handleUpdate}>Update</button>
        </div>

        <div className="rules">
          <h4>Password Rules</h4>
          <ul>
            <li>8–10 characters</li>
            <li>1 Uppercase</li>
            <li>1 Lowercase</li>
            <li>1 Symbol</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetB;
