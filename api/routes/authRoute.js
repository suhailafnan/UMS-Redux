import express from 'express';
import { signup,signin,google,signout ,adminSignIn} from '../controllers/authController.js';
const router=express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.get("/signout",signout);
router.post("/adminSignIn",adminSignIn);
export default router;
