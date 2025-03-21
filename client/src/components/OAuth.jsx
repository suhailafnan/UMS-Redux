import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";  // ✅ Corrected Import
import { useDispatch } from 'react-redux';
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
export default function OAuth() {
    const dispatch=useDispatch()
    const navigate=useNavigate()
   const handleGoogleClick = async () => {

    console.log("Google button clicked!");  // ✅ Debugging
    try {
      const result = await signInWithPopup(auth, googleProvider);  // ✅ Use lowercase `googleProvider`
      console.log("Google Login Success:", result);
      const res=await fetch('/api/auth/google',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            name:result.user.displayName,
            email:result.user.email,
            photo:result.user.photoURL,

            
        }),
      });
      const data=await res.json();
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      console.log("Could not login with Google:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}
