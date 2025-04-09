import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/AuthSlice";
import { post } from "../services/Endpoint";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await post("/auth/login", value);
      const response = request.data;
      if (request.status === 200) {
        dispatch(setUser(response.user));
        navigate("/");
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Login error", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <section className="bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            {/* Logo */}
            <div className="text-center mb-4">
              <Link to="/" className="text-dark text-decoration-none">
                <div className="d-flex align-items-center justify-content-center">
                  <img
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                    alt="Logo"
                    className="me-2"
                    width="32"
                    height="32"
                  />
                  <span className="h4 fw-bold mb-0">CodeByJihad</span>
                </div>
              </Link>
            </div>

            {/* Login Card */}
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <h1 className="h5 mb-4 fw-bold text-center">
                  Sign in to your account
                </h1>

                <form onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      className="form-control"
                      id="email"
                      placeholder="name@company.com"
                      required
                      value={value.email}
                    />
                  </div>

                  {/* Password Input */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      onChange={handleChange}
                      value={value.password}
                      name="password"
                      className="form-control"
                      id="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary w-100 mt-3">
                    Sign in
                  </button>
                </form>

                {/* Sign up Link */}
                <p className="mt-4 mb-0 text-center text-muted">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary text-decoration-none"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
