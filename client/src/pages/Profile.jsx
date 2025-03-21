import React, { useRef, useState , useEffect} from "react";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signOut
} from "../redux/user/userSlice";

export default function Profile() {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null); 
  const [image, setImage] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false); // Loading state added
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setLoading(true);
  
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "First_time_using");
    data.append("cloud_name", "ddsvu2b3o");
  
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dds9jpkcg/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const uploadedImageData = await res.json();
      console.log(uploadedImageData.url, "handleUpload");
  
      // Update formData with the new profile picture URL
      setFormData((prev) => ({ ...prev, profilePicture: uploadedImageData.url }));
  
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  //  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };
  const handleSignOut=async ()=>{
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Hidden File Input */}
        <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

        {/* Profile Image */}
        <div className="relative self-center">
        <img
              className="h-24 w-24 cursor-pointer rounded-full object-cover mt-2"
              src={currentUser.profilePicture}
              alt=""
              onClick={() => fileRef.current.click()}
            />
          </div>
        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser?.email || ""}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteAccount}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut}className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <div>
        {/* <p className="text-red-700 mt-5">{error && "Something went wrong!!"}</p> */}
        <p className="text-green-700 mt-5">
          {updateSuccess && "User is updated!!"}
        </p>
      </div>
    </div>
  );
}
