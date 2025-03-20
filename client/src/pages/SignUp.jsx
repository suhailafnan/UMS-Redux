import React from 'react'
import { useState } from 'react';
import {Link ,useNavigate } from 'react-router-dom'

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(null);
 const  navigate= useNavigate()
  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing on submit

    try {
      setLoading(true);
      setError(false); // Reset error state before making request

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // <- Moved this line outside of fetch()
      console.log(data);
      setLoading(false);
      console.log(data); // Log response to check data
      if(data.success===false){
        setError(true);
        return;
      }
      navigate('/sign-in');

    } catch (error) {
      setLoading(false);
      setError(true);
      console.error("Signup error:", error); // Log error for debugging
    }
  };


 
  return (
    <div className='p-3 max-w-lg mx-auto'>
     <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
     <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
       <input type="text" placeholder='Username' id='username' className='bg-slate-100 p-3 rounded-lg'onChange={handleChanges} />
       <input type="email" placeholder='Email' id='email' className='bg-slate-100 p-3 rounded-lg'onChange={handleChanges} />
       <input type="password" placeholder='Password' id='password' className='bg-slate-100 p-3 rounded-lg' onChange={handleChanges} />
       <button type="submit"  disabled={loading}className=' bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 '>
        {loading?'Loading...':'Sign Up'}</button>
     </form>

     <div className="flex gap-2 mt-5">
      <p>Have an account?</p>
      <Link to='/sign-in'>
      <span className='text-blue-500'>Sign In </span>
      </Link>
     
     </div>
     <div>
      <p className='text-red-700 mt-5'>{error && "Something went wrong!!"}</p>
     </div>
    </div>
  )
}
