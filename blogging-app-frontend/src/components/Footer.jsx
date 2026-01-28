import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-left">
        <p>Terms & Conditions</p>
        <p>Privacy Policy</p>
        <p>Contact Us</p>
      </div>

      <div className="footer-center">
        <p>@Copyright BlogVerse</p>
      </div>

      <div className="footer-right">
        <FaLinkedin className="social-icon" />
        <FaTwitter className="social-icon" />
        <FaInstagram className="social-icon" />
        <p className="contact-email">
          amolyenge.sde2025@gmail.com
        </p>
      </div>
    </footer>
  );
};

export default Footer;
