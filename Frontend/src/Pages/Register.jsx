import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/Endpoint";

export default function Register() {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    fullName: "",
    email: "",
    password: "",
    image: null, // Profile Image
  });

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setValue({ ...value, image: reader.result });
      };
    }
  };

  // Trigger File Input
  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      FullName: value.fullName,
      email: value.email,
      password: value.password,
      profile: value.image, // Base64 Encoded Image
    };

    try {
      const response = await post("/auth/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        toast.success(response.data.message);

        // No password removal, the response includes password
        const userData = response.data.user;

        // Navigate to login page
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <section className="bg-light">
      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 py-4">
        <Link to="/" className="mb-4 text-dark text-decoration-none">
          <img
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
            width="32"
            height="32"
            className="me-2"
          />
          <span className="h4 fw-bold">CodeByJihad</span>
        </Link>
        <div className="card shadow-sm w-100" style={{ maxWidth: "400px" }}>
          <div className="card-body p-4">
            <h1 className="h5 fw-bold text-dark text-center">
              Create an account
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-3">
                <label className="form-label">Profile Picture</label>
                <div className="d-flex justify-content-center">
                  <img
                    src={
                      value.image
                        ? value.image
                        : "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                    }
                    alt="avatar"
                    className="rounded-circle"
                    width="100"
                    height="100"
                    style={{ cursor: "pointer" }}
                    onClick={handleImageClick}
                  />
                </div>
                <input
                  type="file"
                  className="form-control d-none"
                  id="imageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="John Doe"
                  required
                  value={value.fullName}
                  onChange={(e) =>
                    setValue({ ...value, fullName: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@company.com"
                  required
                  value={value.email}
                  onChange={(e) =>
                    setValue({ ...value, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="••••••••"
                  required
                  value={value.password}
                  onChange={(e) =>
                    setValue({ ...value, password: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Sign up
              </button>
            </form>
            <p className="mt-3 mb-0 text-muted text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
