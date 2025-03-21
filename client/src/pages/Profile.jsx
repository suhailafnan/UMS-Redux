import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(currentUser?.profilePicture || "");

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview before uploading
      uploadImage(file);
    }
  };

  // Secure Cloudinary Upload
  const uploadImage = async (file) => {
    try {
      // Step 1: Get Signature from Backend
      const { data } = await axios.post("http://localhost:3000/api/cloudinary-signature");
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY); // ✅ Use env variable
      formData.append("timestamp", data.timestamp);
      formData.append("signature", data.signature);
      formData.append("folder", "profile_pictures"); // Optional: Store in a folder
  
      // Step 2: Upload to Cloudinary
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dds9jpkcg/image/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } } // ✅ Add headers
      );
  
      const imageUrl = response.data.secure_url;
      setPreview(imageUrl);
      alert("✅ Image uploaded successfully!");
  
      // Step 3: Update Backend with Image URL
      await axios.put("http://localhost:3000/api/user/update-profile", {
        userId: currentUser._id,
        profilePicture: imageUrl,
      });
  
    } catch (error) {
      console.error("❌ Upload failed:", error.response?.data?.error?.message || error);
      alert("❌ Failed to upload image.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        {/* Hidden File Input */}
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleFileChange} />

        {/* Profile Image */}
        <img
          src={preview}
          alt="profile"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          onClick={() => fileRef.current.click()}
        />

        <input defaultValue={currentUser.username} type="text" id="username" placeholder="Username"
          className="bg-slate-100 rounded-lg p-3" />
        <input defaultValue={currentUser?.email || ""} type="email" id="email" placeholder="Email"
          className="bg-slate-100 rounded-lg p-3" />
        <input type="password" id="password" placeholder="Password"
          className="bg-slate-100 rounded-lg p-3" />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
