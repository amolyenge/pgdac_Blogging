import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* HEADER */}
      <header className="landing-header">
        <div className="logo-section">
          <img src={logo} alt="BlogVerse Logo" className="logo-img" />
          <h1 className="brand-name">BlogVerse</h1>
        </div>

        <h2 className="tagline">
          Welcome to BlogVerse – Where Ideas Turn Into Stories
        </h2>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <p className="quote">“Write to express, not to impress.”</p>

        <div className="action-buttons">
          <button className="primary-btn" onClick={() => navigate("/register")}>
            Register
          </button>
          <button className="secondary-btn" onClick={() => navigate("/login")}>
            Log in
          </button>
        </div>
      </section>

      {/* WHY BLOGVERSE */}
      <section className="why-section">
        <h2 className="why-title">Why BlogVerse?</h2>

        <div className="reason-grid">
          {[
            "Express Freely",
            "Clean Writing Space",
            "Share Ideas",
            "Grow Audience",
            "Learn Daily",
            "Community Driven",
          ].map((reason, index) => (
            <div key={index} className="reason-card">
              {reason}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} BlogVerse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
