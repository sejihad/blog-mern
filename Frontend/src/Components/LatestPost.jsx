import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../services/Endpoint";
import "./LatestPost.css";

export default function LatestPost() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await get("/blog/GetPosts");
        setBlogs(response.data.posts || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const truncateText = (text, wordLimit = 20) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  if (loading) return <div className="loading-spinner">Loading posts...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!blogs.length) return <div className="no-posts">No posts available</div>;

  return (
    <section className="latest-posts">
      <div className="section-header">
        <h2>Recent Posts</h2>
      </div>

      <div className="posts-grid">
        {blogs.map((post) => (
          <article
            className="post-card"
            key={post._id}
            onClick={() => handleBlogClick(post._id)}
            aria-label={`Read ${post.title}`}
          >
            <div className="post-image-container">
              <img
                src={post.image?.url || "/default-post-image.jpg"}
                alt={post.title}
                className="post-image"
                loading="lazy"
              />
            </div>
            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-excerpt">
                {truncateText(post.desc)}
                {post.desc?.split(/\s+/).length > 20 && (
                  <span className="read-more-text"> (read more)</span>
                )}
              </p>
              <button className="read-more-btn">Read Article</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
