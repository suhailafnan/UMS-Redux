import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/adminControllers.js';
import { checkIfUserExists } from '../utils/checkIfUserExists.js';



const router = express.Router()

router.get('/users', verifyToken, getAllUsers)
router.post('/users', verifyToken, checkIfUserExists, createUser)
router.put('/users/:id', verifyToken, checkIfUserExists, updateUser)
router.delete('/users/:id', verifyToken, deleteUser)

export default router