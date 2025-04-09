import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { get, post } from "../services/Endpoint";
import "./Blog.css";
export default function Blog() {
  const { postId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [singlePost, setSinglePost] = useState(null);
  const [comment, setComment] = useState("");
  const [loaddata, setLoaddata] = useState(false);

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        const request = await get(`/public/Singlepost/${postId}`);
        setSinglePost(request.data.Post);
      } catch (error) {
        toast.error("Failed to load post");
      }
    };
    fetchSinglePost();
  }, [loaddata, postId]);

  const onSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    try {
      const request = await post("/comment/addcomment", {
        comment,
        postId,
        userId: user._id,
      });
      if (request.data.success) {
        toast.success(request.data.message);
        setComment("");
        setLoaddata((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="blog-container">
      <article className="blog-post">
        {singlePost && (
          <>
            <header className="post-header">
              <h1 className="post-title">{singlePost.title}</h1>
              <div className="post-image-container">
                <img
                  src={`${singlePost.image.url}`}
                  alt={singlePost.title}
                  className="post-image"
                />
              </div>
            </header>

            <div className="post-content">
              <p className="post-body">{singlePost.desc}</p>
            </div>

            <section className="comment-section">
              <div className="divider"></div>

              <h2 className="section-title">Leave a Comment</h2>
              <form className="comment-form" onSubmit={onSubmitComment}>
                <div className="form-group">
                  <textarea
                    className="comment-input"
                    rows="4"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-button">
                  Post Comment
                </button>
              </form>

              <div className="divider"></div>

              <h2 className="section-title">Comments</h2>
              <div className="comments-list">
                {singlePost.comments?.map((elem) => (
                  <div className="comment-card" key={elem._id}>
                    <img
                      src={`${elem.userId.profile.url}`}
                      alt={elem.userId.FullName}
                      className="comment-avatar"
                    />
                    <div className="comment-content">
                      <h4 className="comment-author">{elem.userId.FullName}</h4>
                      <p className="comment-text">{elem.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </article>
    </div>
  );
}
