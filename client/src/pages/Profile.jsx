import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signOut,
  updateProfilePictureStart,
  updateProfilePictureSuccess,
  updateProfilePictureFailure,
} from "../redux/user/userSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setErrorMessage(""); // Clear previous errors
    dispatch(updateProfilePictureStart());
  
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mern-auth-redux");
  
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dds9jpkcg/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
  
      const uploadedImageData = await res.json();
      if (!res.ok || !uploadedImageData.secure_url) {
        throw new Error("Failed to upload image");
      }
  
      // ✅ Save the image URL in formData
      setFormData((prev) => ({
        ...prev,
        profilePicture: uploadedImageData.secure_url, // Add image URL
      }));
  
      dispatch(updateProfilePictureSuccess(uploadedImageData.secure_url));
    } catch (error) {
      setErrorMessage(error.message);
      dispatch(updateProfilePictureFailure(error.message));
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    dispatch(updateUserStart());
  
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // ✅ Ensure image URL is sent
      });
  
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Update failed");
      }
  
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      setErrorMessage(error.message);
      dispatch(updateUserFailure(error));
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to delete account");
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      setErrorMessage(error.message);
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
    } catch (error) {
      setErrorMessage("Sign out failed");
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>

      {/* Profile Image Upload */}
      <div className="relative flex justify-center">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
  className="h-24 w-24 cursor-pointer rounded-full object-cover border-2 border-gray-300"
  src={formData.profilePicture || currentUser.profilePicture} // Show new image
  alt="Profile"
  onClick={() => fileRef.current.click()}
/>

      </div>

      <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-gray-100 rounded-lg p-3 focus:ring focus:ring-blue-300"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-gray-100 rounded-lg p-3 focus:ring focus:ring-blue-300"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="New Password"
          className="bg-gray-100 rounded-lg p-3 focus:ring focus:ring-blue-300"
          onChange={handleChange}
        />

        {/* Update Button */}
        <button
          className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>

      {/* Action Links */}
      <div className="flex justify-between mt-5 text-sm">
        <button
          onClick={handleDeleteAccount}
          className="text-red-600 hover:underline"
        >
          Delete Account
        </button>
        <button onClick={handleSignOut} className="text-blue-600 hover:underline">
          Sign Out
        </button>
      </div>

      {/* Status Messages */}
      {updateSuccess && <p className="text-green-600 mt-3">Profile updated successfully!</p>}
      {errorMessage && <p className="text-red-600 mt-3">{errorMessage}</p>}
    </div>
  );
}
