import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  fetchAllBlogs,
  fetchTrendingBlogs,
  fetchCategoryBlogs,
  searchBlogsByAuthor
} from "../api/blogApi";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState("all");
  const [category, setCategory] = useState("");

  const [searchText, setSearchText] = useState("");

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

  const handleSearch = async () => {
    // If the search box is empty, just reload All
    if (!searchText.trim()) {
      setMode("all");
      loadAll();
      return;
    }

    setLoading(true);
    try {
      const res = await searchBlogsByAuthor(searchText.trim());
      setBlogs(res.data);
      setMode("search"); // optional if you want to track mode
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load according to mode
    if (mode === "all") loadAll();
    if (mode === "trending") loadTrending();
    if (mode === "category") loadCategory(category);
    // We *don’t* run search in useEffect
  }, [mode, category]);

  return (
    <>
      <Header setMode={setMode} setCategory={setCategory} />

      <div className="home-container">

        {/* ===== SEARCH BAR ===== */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by author..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="btn-search" onClick={handleSearch}>
            Search
          </button>
        </div>

        {loading && <p className="status">Loading blogs...</p>}

        {!loading && blogs.length === 0 && (
          <p className="status">No blogs to show</p>
        )}

        <div className="blog-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              {blog.thumbnailUrl && (
                <img
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  className="blog-img"
                />
              )}

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
