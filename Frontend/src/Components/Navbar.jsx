import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../redux/AuthSlice";
import { post } from "../services/Endpoint";
import "./Navbar.css";
export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      const request = await post("/auth/logout");
      const response = request.data;
      if (request.status === 200) {
        navigate("/login");
        dispatch(removeUser());
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar-content">
        <Link to={"/"} className="logo-link">
          <h1 className="logo-text">CodeByJihad</h1>
        </Link>

        <div className="nav-actions">
          {!user ? (
            <Link to={"/login"}>
              <button className="signin-btn">Sign in</button>
            </Link>
          ) : (
            <div className="profile-dropdown">
              <div className="avatar-wrapper" data-bs-toggle="dropdown">
                <img
                  src={`${user.profile.url}`}
                  alt="Profile"
                  className="profile-avatar"
                />
              </div>
              <ul className="dropdown-menu">
                {user.role === "admin" && (
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link className="dropdown-item" to={`/profile/${user._id}`}>
                    Profile
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
