import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'


function AdminSignIn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({})
    const { loading, error } = useSelector((state) => state.user)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                dispatch(signInStart())
                const res = await fetch('/api/auth/adminSignIn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                console.log('data/////',data)

                if (data.success === false) {
                    console.log("admin signIn failed")
                    dispatch(signInFailure(data.message))
                    return
                }
                const adminData = { ...data.admin, isAdmin: true };
                dispatch(signInSuccess(adminData))
                navigate('/admin/dashboard');
            } catch (error) {
                console.log(error)
            }

    };
    return (
        <div className='p-3 max-w-lg mx-auto mt-35'>
            <h1 className='text-3xl text-center font-semibold my-7'>Admin</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="email" placeholder='email'
                    id='email' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
                <input type="password" placeholder='password'
                    id='password' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
                <button className='bg-black text-white p-3 rounded-lg uppercase hover:opacity-80' >
                    {loading ? 'Loading.....' : 'Sign In'}
                </button>

            </form>
            <p className="text-red-700">
                {error && typeof error === 'string' && error}
            </p>


        </div>
    )
}


export default AdminSignIn