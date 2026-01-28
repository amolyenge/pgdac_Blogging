import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { reportBlog } from "../api/blogApi";
import "./ReportBlog.css";

const ReportBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Please describe the reason for reporting.");
      return;
    }

    try {
      const res = await reportBlog(id, reason);
      setMessage(res.data || "Blog reported successfully");
      
      // Redirect back to the read blog page after a short delay
      setTimeout(() => {
        navigate(`/read-blog/${id}`);
      }, 1200);
    } catch (err) {
      setError("Failed to report the blog. Try again.");
    }
  };

  return (
    <>
      <Header setMode={() => {}} setCategory={() => {}} />

      <div className="reportblog-container">
        <h2 className="reportblog-title">Report Blog</h2>

        <textarea
          className="report-textarea"
          placeholder="Describe the problem or reason for reporting..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError("");
            setMessage("");
          }}
        />

        {error && <p className="report-error">{error}</p>}
        {message && <p className="report-success">{message}</p>}

        <button className="report-submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <Footer />
    </>
  );
};

export default ReportBlog;
