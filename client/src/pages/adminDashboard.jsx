import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux'
import { signOut } from '../redux/user/userSlice'

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
    const [updateUser, setUpdateUser] = useState({});
    const [loading, setLoading] = useState(true); 

    
    const dispatch = useDispatch()

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/admin/users?search=${search}`,{
                method: 'GET',
            });
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
        finally {
            setLoading(false); 
        }
    };

    const handleDelete = async (userId) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!data.success) {
                toast.success("Deleted Successfully!")
                fetchUsers();
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    const handleUpdate = async (userId) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(updateUser),
            });

            const data = await res.json();
            if (data.message != 'User with this email already exists!') {
                setShowModal(false);
                toast.success("User Data Updated!")
                fetchUsers();
            }
            toast.error(data.message);
        } catch (error) {
            console.log(error);
            toast.error(error);
        }

    };

    const handleAddUser = async () => {
        try {

            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const data = await res.json();
            if (data.message != 'User with this email already exists!') {
                setShowModal(false);
                toast.success("User Added Successfully!");
                
                fetchUsers();
            }
            console.log(data)
            toast.error(data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.code.split('/')[1].split('-').join(" "));
        }
    };

    const handleSignOut = async () => {
        try {
            const res = await fetch("/api/auth/signout", {
                method: "POST", // Ensure it's a POST request for better security
            });
            dispatch(signOut())
        } catch (error) {
            console.log(error)
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-gray-500 font-semibold">Loading...</p>
            </div>
        );
    }


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
      
          <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
              className="w-full sm:w-2/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex mt-4 sm:mt-0 sm:gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add User
              </button>
              <button
                onClick={handleSignOut}
                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
      
          <div className="overflow-x-auto sm:overflow-x-hidden">
          <table className="w-full table-auto sm:table-fixed border-collapse bg-gray-900 shadow-lg rounded-lg overflow-hidden">
  <thead className="bg-gray-800 text-white">
    <tr>
      <th className="p-3 text-left text-xs sm:text-base border-b border-gray-700">Username</th>
      <th className="p-3 text-left text-xs sm:text-base border-b border-gray-700">Email</th>
      <th className="p-3 text-left text-xs sm:text-base border-b border-gray-700">Actions</th>
    </tr>
  </thead>
  <tbody>
    {!users ? (
      <tr>
        <td colSpan="3" className="p-3 text-center text-white">No users found.</td>
      </tr>
    ) : (
      users.map((user) => (
        <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-800 text-white">
          <td className="p-3 text-xs sm:text-base">
            <input
              onChange={(e) => setUpdateUser({ ...updateUser, username: e.target.value })}
              type="text"
              defaultValue={user.username}
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
          </td>
          <td className="p-3 text-xs sm:text-base">
            <input
              onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
              type="email"
              defaultValue={user.email}
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
          </td>
          <td className="p-3 flex gap-2 text-xs sm:text-base">
            <button
              onClick={() => handleUpdate(user._id)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(user._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

          </div>
        </div>
      
        {/* Add User Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <input
                type="text"
                placeholder="Username"
                value={newUser?.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser?.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser?.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    );
}

export default AdminDashboard;