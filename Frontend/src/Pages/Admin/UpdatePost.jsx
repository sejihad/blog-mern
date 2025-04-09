import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { get, patch } from "../../services/Endpoint";

export default function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    desc: "",
    image: { url: "" },
  });
  const [originalImageUrl, setOriginalImageUrl] = useState(""); // Store the original image URL
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the post data when the component is mounted
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await get(`/public/Singlepost/${id}`);
        setPost(response.data.Post);
        setOriginalImageUrl(response.data.Post.image.url); // Store the original image URL
      } catch (error) {
        toast.error("Failed to load post data.");
      }
    };
    fetchPost();
  }, [id]);

  // Handle image change and convert it to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPost({
          ...post,
          image: { url: reader.result }, // Convert image to Base64 string
        });
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  // Handle the form submission and update the post
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Create an object to hold the updated fields
    const updatedPostData = {};

    // Only add fields that have been updated
    if (post.title !== "") {
      updatedPostData.title = post.title;
    }
    if (post.desc !== "") {
      updatedPostData.desc = post.desc;
    }

    // Send image data only if it's updated
    if (post.image.url !== "" && post.image.url !== originalImageUrl) {
      updatedPostData.image = post.image.url; // Send base64 image if it's updated
    }

    try {
      const response = await patch(`/blog/update/${id}`, updatedPostData);
      if (response.data.success) {
        toast.success("Post updated successfully!");
        navigate("/dashboard/allposts");
      } else {
        toast.error("Failed to update post.");
      }
    } catch (error) {
      toast.error("An error occurred while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h2 className="text-center mb-0">Edit Post</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleUpdate}>
                {/* Image upload section */}
                <div className="mb-4">
                  <label htmlFor="postImage" className="form-label">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange} // Handle image upload
                  />
                  {post.image && (
                    <div className="mt-2">
                      <img
                        src={post.image.url}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>

                {/* Title input section */}
                <div className="mb-4">
                  <label htmlFor="postTitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="postTitle"
                    placeholder="Enter post title"
                    value={post.title}
                    onChange={(e) =>
                      setPost({ ...post, title: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Description input section */}
                <div className="mb-4">
                  <label htmlFor="postDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="postDescription"
                    rows="6"
                    placeholder="Write your post description here"
                    value={post.desc}
                    onChange={(e) => setPost({ ...post, desc: e.target.value })}
                    required
                  ></textarea>
                </div>

                {/* Submit button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Update Post"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
