import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera, FaLock, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setUser } from "../redux/AuthSlice";
import { patch } from "../services/Endpoint";

export default function Profile() {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState("");
  const [profilePublicId, setProfilePublicId] = useState("");
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      setName(user.FullName);
      setProfileImage(user.profile?.url || "");
      setProfilePublicId(user.profile?.public_id || "");
    }
  }, [user]);

  // ✅ Image Convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Validate password fields if either is filled
    if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
      toast.error("Please fill both password fields to change password");
      return;
    }

    const requestBody = {
      ...(name && { FullName: name }),
      ...(oldPassword &&
        newPassword && {
          oldpassword: oldPassword,
          newpassword: newPassword,
        }),
      ...(profileImage &&
        profileImage !== user.profile?.url && {
          profile: {
            url: profileImage,
            public_id: profilePublicId,
          },
        }),
    };

    try {
      const response = await patch(`auth/profile/${userId}`, requestBody);
      if (response.status === 200) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.user));
        // Reset password fields after successful update
        setOldPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Profile update failed. Please try again."
      );
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Update Profile</h1>
      <form className="profile-form" onSubmit={handleUpdateProfile}>
        <div className="profile-image-section">
          <label htmlFor="profileImage" className="profile-image-label">
            {profileImage ? (
              <img src={profileImage} alt="Avatar" className="profile-image" />
            ) : (
              <div className="profile-placeholder">
                <FaUser className="profile-icon" />
              </div>
            )}
            <FaCamera className="profile-camera-icon" />
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="profile-image-input"
          />
        </div>

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Update Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="profile-input"
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="profile-input"
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="profile-input"
          />
        </div>

        <button type="submit" className="profile-button">
          Update Profile
        </button>
      </form>
    </div>
  );
}
