import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Dashboard/Sidebar";
import Navbar from "../Components/Navbar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column flex-md-row">
        <Sidebar />
        <div className="content flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}
