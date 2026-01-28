import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchUserDetails, fetchUserBlogs } from "../api/userApi";
import { fetchBlogById, deleteBlog } from "../api/blogApi";
import axiosInstance from "../api/axiosInstance"; // use axiosInstance for PUT
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const [editing, setEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    thumbnail: null,
  });

  // Load user + blogs
  const loadUser = async () => {
    try {
      const res = await fetchUserDetails();
      setUser(res.data);
      loadUserBlogs(res.data.id);
    } catch (err) {
      console.error("Failed to load user data", err);
    }
  };

  const loadUserBlogs = async (userId) => {
    try {
      const res = await fetchUserBlogs(userId);
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to load user blogs", err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Click edit → prefill form
  const handleEditClick = async (blogId) => {
    try {
      const res = await fetchBlogById(blogId);
      const blog = res.data;

      setCurrentBlog(blog);
      setForm({
        title: blog.title || "",
        content: blog.content || "",
        category: blog.category || "",
        thumbnail: null,
      });

      setEditing(true);
    } catch (err) {
      console.error("Failed to fetch blog", err);
    }
  };

  const handleDeleteClick = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(blogId);
      setBlogs(blogs.filter((b) => b.id !== blogId));
    } catch (err) {
      console.error("Failed to delete blog", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const handleUpdateSubmit = async () => {
    if (!currentBlog) return;

    try {
      // Build multipart FormData
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("category", form.category);

      if (form.thumbnail) {
        formData.append("thumbnail", form.thumbnail);
      }

      // IMPORTANT: PUT with multipart/form-data
      await axiosInstance.put(
        `/blogs/${currentBlog.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh list
      loadUserBlogs(user.id);
      setEditing(false);
      setCurrentBlog(null);
    } catch (err) {
      console.error("Failed to update blog", err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Header setMode={() => {}} setCategory={() => {}} />

      <div className="userprofile-container">
        {/* Left list */}
        <div className="user-left">
          <h2>{user.username}</h2>
          <p>{user.email}</p>

          <h3>Authored Blogs</h3>
          {blogs.map((b) => (
            <div key={b.id} className="user-blog-item">
              <span className="user-blog-title">{b.title}</span>

              <div className="user-blog-actions">
                <button onClick={() => handleEditClick(b.id)}>Edit</button>
                <button onClick={() => handleDeleteClick(b.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right form */}
        <div className={`user-right ${editing ? "visible" : "hidden"}`}>
          {editing ? (
            <>
              <h3>Edit Blog</h3>

              <label>Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
              />

              <label>Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleInputChange}
              />

              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Sports">Sports</option>
                <option value="Religion And Traditions">
                  Religion And Traditions
                </option>
                <option value="Business">Business</option>
                <option value="Healthcare">Healthcare</option>
              </select>

              <label>Upload New Thumbnail (png/jpg)</label>
              <input
                type="file"
                accept=".png,.jpeg,.jpg"
                onChange={handleImageChange}
              />

              <button
                className="btn-update"
                onClick={handleUpdateSubmit}
              >
                Update
              </button>
            </>
          ) : (
            <p className="placeholder-text">Select a blog to edit</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserProfile;
