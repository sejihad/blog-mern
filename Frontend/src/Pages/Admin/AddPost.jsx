import React, { useState } from "react";
import toast from "react-hot-toast";
import { post } from "../../services/Endpoint";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // This will be the Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const postData = {
        title,
        desc: description,
        image,
      };

      const response = await post("/blog/create", postData);

      if (response.data.success) {
        toast.success(response.data.message);
        setTitle("");
        setDescription("");
        setImage(null);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
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
              <h2 className="text-center mb-0">Add New Post</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="postImage" className="form-label">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  {image && (
                    <div className="mt-2">
                      <img
                        src={image}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="postTitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="postTitle"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="postDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="postDescription"
                    rows="6"
                    placeholder="Write your post description here"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Submit Post"}
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
