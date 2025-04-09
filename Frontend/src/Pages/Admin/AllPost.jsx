import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { delet, get } from "../../services/Endpoint";

export default function AllPost() {
  const [posts, setPosts] = useState([]);
  const [loadedata, setLoadedata] = useState(false);

  const handleDelete = async (postId) => {
    // Display a confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmed) {
      try {
        const response = await delet(`/blog/delete/${postId}`);
        const data = response.data;

        if (data.success) {
          toast.success(data.message);
          setLoadedata(!loadedata);
        } else {
          toast.error("Failed to delete the user.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // setError(error.response.data.message); // Set error message from server response
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  useEffect(() => {
    const getposts = async () => {
      try {
        const resposne = await get("/blog/GetPosts");
        const data = resposne.data;
        setPosts(data.posts);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getposts();
  }, [loadedata]);
  return (
    <div className="container ">
      <h1 className="text-center mb-4 text-white">All Posts</h1>
      <div className="row">
        {posts &&
          posts.map((post, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div className="card h-100">
                <img
                  src={`${post.image.url}`}
                  className="card-img-top"
                  alt={post.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.description}</p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post._id)}
                  >
                    <FaTrashAlt /> Delete
                  </button>
                  <Link
                    to={`/dashboard/updatepost/${post._id}`}
                    className="btn btn-warning"
                  >
                    <FaEdit /> Update
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
