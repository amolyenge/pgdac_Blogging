import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosInstance from "../api/axiosInstance";
import mammoth from "mammoth/mammoth.browser"; // For DOCX import
import "./WriteBlog.css";

const WriteBlog = () => {
  const navigate = useNavigate();

  const [importFile, setImportFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const extractTextFromFile = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase();

    try {
      if (ext === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value || "";
      }

      if (ext === "txt" || ext === "csv") {
        return await file.text();
      }

      if (ext === "pdf") {
        // PDF import fallback: asks user to copy/paste
        alert(
          "PDF import isn’t supported in this version. Please open your PDF and copy text into the editor."
        );
        return "";
      }

      return "";
    } catch (err) {
      console.error("Error extracting text:", err);
      return "";
    }
  };

  const handleImportChange = async (e) => {
    const file = e.target.files[0];
    setImportFile(file);
    if (file) {
      const extracted = await extractTextFromFile(file);
      setContent((prev) => prev + extracted);
    }
  };

  const handleClear = () => {
    setTitle("");
    setCategory("");
    setImageFile(null);
    setContent("");
    setImportFile(null);
    setMessage("");
    setError("");
  };

  const handlePost = async () => {
    setMessage("");
    setError("");

    if (!title || !category || !content) {
      setError("Title, category, and content are required.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a PNG or JPEG thumbnail image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("thumbnail", imageFile);

    try {
      const res = await axiosInstance.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Blog created successfully");
      setTimeout(() => {
        navigate("/home");
      }, 1200);
    } catch (err) {
      console.error("Error creating blog:", err);
      setError("Error occurred while creating blog.");
    }
  };

  return (
    <>
      <Header setMode={() => {}} setCategory={() => {}} />

      <div className="writeblog-container">
        <h2>Write a New Blog</h2>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        {/* Import File */}
        <label className="field-label">
          Import File (docx, txt, csv)
        </label>
        <input
          type="file"
          accept=".docx,.txt,.csv"
          onChange={handleImportChange}
          className="input-file"
        />

        {/* Title */}
        <label className="field-label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-text"
        />

        {/* Category Dropdown */}
        <label className="field-label">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-select"
        >
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Sports">Sports</option>
          <option value="Religion And Traditions">Religion And Traditions</option>
          <option value="Business">Business</option>
          <option value="Healthcare">Healthcare</option>
        </select>

        {/* Thumbnail Image */}
        <label className="field-label">
          Thumbnail Image (png, jpeg)
        </label>
        <input
          type="file"
          accept=".png,.jpeg,.jpg"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="input-file"
        />

        {/* Content */}
        <label className="field-label">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea-content"
        />

        {/* Buttons */}
        <div className="writeblog-buttons">
          <button className="btn-clear" onClick={handleClear}>
            Clear
          </button>
          <button className="btn-post" onClick={handlePost}>
            Post
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default WriteBlog;
