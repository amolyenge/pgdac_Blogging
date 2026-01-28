import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  fetchAllBlogs,
  fetchTrendingBlogs,
  fetchCategoryBlogs,
} from "../api/blogApi";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // mode: "all", "trending", "category"
  const [mode, setMode] = useState("all");
  const [category, setCategory] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await fetchAllBlogs();
      setBlogs(res.data);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTrending = async () => {
    setLoading(true);
    try {
      const res = await fetchTrendingBlogs();
      setBlogs(res.data);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategory = async (cat) => {
    setLoading(true);
    try {
      const res = await fetchCategoryBlogs(cat);
      setBlogs(res.data);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "all") loadAll();
    if (mode === "trending") loadTrending();
    if (mode === "category") loadCategory(category);
  }, [mode, category]);

  return (
    <>
      <Header setMode={setMode} setCategory={setCategory} />

      <div className="home-container">
        {loading && <p className="status">Loading blogs...</p>}

        {!loading && blogs.length === 0 && (
          <p className="status">No blogs to show</p>
        )}

        <div className="blog-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                className="blog-img"
                onError={(e) => (e.target.style.display = "none")}
              />

              <h3 className="blog-title">{blog.title}</h3>

              <p className="blog-category">#{blog.category}</p>

              <p className="blog-author">Author: {blog.author}</p>

              <div className="blog-footer">
                <span className="likes">❤️ {blog.likesCount}</span>
                <button
                  className="read-more-btn"
                  onClick={() => navigate(`/read-blog/${blog.id}`)}
                >
                  Read More…
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
