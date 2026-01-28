import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  fetchBlogById,
  likeBlog,
  fetchComments,
  postComment,
} from "../api/blogApi";
import "./ReadBlog.css";

const ReadBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const res = await fetchBlogById(id);
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      }
    };
    loadBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await likeBlog(id);
      if (res.data) {
        setMessage(res.data);
      } else {
        setMessage("Blog liked");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const msg = err.response.data;
        if (
          msg.toLowerCase().includes("already") ||
          msg.toLowerCase().includes("liked")
        ) {
          setMessage("You already liked this blog");
        } else {
          setMessage("Failed to like");
        }
      } else {
        setMessage("Failed to like");
      }
    }
  };

  const handleShowComments = async () => {
    try {
      const res = await fetchComments(id);
      setComments(res.data);
      setShowComments(true);
    } catch {
      setMessage("Failed to load comments");
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      await postComment(id, newComment);
      setNewComment("");
      handleShowComments();
    } catch {
      setMessage("Failed to post comment");
    }
  };

  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    const text = `Check out this blog: ${blog?.title}`;
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
        break;
      default:
        break;
    }

    if (url) window.open(url, "_blank");
    setShowShareOptions(false);
  };

  if (!blog) return <p>Loading...</p>;

  const publishedDate = new Date(blog.createdAt).toLocaleDateString();

  return (
    <>
      <Header setMode={() => {}} setCategory={() => {}} />

      <div className="readblog-container">
        <h1 className="readblog-title">{blog.title}</h1>

        <div className="readblog-meta">
          <span>Author: {blog.author}</span>
          <span>Published on: {publishedDate}</span>
          <span>Category: {blog.category}</span>
        </div>

        <img
          src={blog.thumbnailUrl}
          alt={blog.title}
          className="readblog-img"
        />

        <div className="readblog-content">
          {blog.content.split("\n").map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        <div className="readblog-actions">
          <button className="action-btn like-btn" onClick={handleLike}>
            ❤️ Like
          </button>

          <button
            className="action-btn comment-btn"
            onClick={handleShowComments}
          >
            💬 Comment
          </button>

          <div className="share-dropdown-container">
            <button
              className="action-btn share-btn"
              onClick={() => setShowShareOptions((prev) => !prev)}
            >
              🔗 Share
            </button>

            {showShareOptions && (
              <div className="share-options">
                <p onClick={() => handleShare("twitter")}>🐦 Twitter</p>
                <p onClick={() => handleShare("linkedin")}>💼 LinkedIn</p>
                <p onClick={() => handleShare("facebook")}>📘 Facebook</p>
                <p onClick={() => handleShare("copy")}>📋 Copy Link</p>
              </div>
            )}
          </div>

          <button
            className="action-btn report-btn"
            onClick={() => navigate(`/report/${id}`)}
          >
            🚩 Report
          </button>
        </div>

        {message && <p className="status-message">{message}</p>}

        {showComments && (
          <div className="comments-section">
            <h3>Comments</h3>
            {comments.map((c) => (
              <div key={c.id} className="comment-item">
                <p>{c.content}</p>
                <small>— {c.author}</small>
              </div>
            ))}

            <div className="new-comment">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handlePostComment}>Post</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ReadBlog;
