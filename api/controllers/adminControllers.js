// routes/user.js
import express from 'express';
import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';

const router = express.Router();

// Get all users with optional search query
export const getAllUsers = async (req, res, next) => {
    const { search } = req.query;

    try {
        const users = await User.find({
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        });
        console.log("users/",users)
        res.status(200).json(users);
    } catch (error) {
        console.log(error)
        next(error);
    }
};

// Create a new user
export const createUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

// Update user data
export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { username, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};