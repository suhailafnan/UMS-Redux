import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Clear error message when component mounts
  useEffect(() => {
    dispatch(signInFailure(null)); // Reset error state
  }, [dispatch]);

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message || "Sign-in failed"));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message || "Something went wrong"));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" id="email" className="bg-slate-100 p-3 rounded-lg" onChange={handleChanges} />
        <input type="password" placeholder="Password" id="password" className="bg-slate-100 p-3 rounded-lg" onChange={handleChanges} />
        <button type="submit" disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>

      {/* ✅ Only show error if it exists */}
      {error && <p className="text-red-700 mt-5">{typeof error === 'string' ? error : error.message || "Something went wrong!"}</p>}
    </div>
  );
}
