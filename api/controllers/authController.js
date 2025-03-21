import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import errorHandling from '../utils/error.js';
import jwt from "jsonwebtoken"

export const signup = async(req,res,next)=>{
   const {username,email,password} = req.body;
   const hashedPassword = bcryptjs.hashSync(password,10)
   const newUser = new User({username,email,password:hashedPassword})
   try {
    await newUser.save();
   res.status(201).json({message:"User created successfully"})

   } catch (error) {
    next(errorHandling(500,"something went wrong"))
   } 
   }  

  export const signin = async(req,res,next)=>{
   const {email,password} = req.body;
   try {
      const validUser = await User.findOne({email:email});
      if(!validUser) return next(errorHandling(401,"User Not Found"));

      const validPassword = bcryptjs.compareSync(password,validUser.password);
      if(!validPassword) return next(errorHandling(403,"Wrong credentials"));

      const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validUser._doc;
      const expiryDate = new Date(Date.now() + 3600000);  
      
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict', 
        expires: expiryDate
      })
      .status(200)
      .json({ success: true, user: rest, token });
      

   } catch (error) {
      next(error);
   }
}


   export const google = async (req, res, next) => {
      try {
          const user = await User.findOne({ email: req.body.email });
  
          if (user) {
              // Existing user
              const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
              const { password: hashedPassword, ...rest } = user._doc;
              const expiryDate = new Date(Date.now() + 3600000);
  
              return res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                  .status(200)
                  .json(rest);
          } 
  
          // New user creation
          const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
  
          const newUser = new User({
              username: req.body.name.split(" ").join('').toLowerCase() + Math.random().toString(36).slice(-8),
              email: req.body.email,
              password: hashedPassword,
              profilePicture: req.body.photo
          });
  
          await newUser.save();
  
          const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
          const { password: hashedPasswordNew, ...rest } = newUser._doc;
          const expiryDate = new Date(Date.now() + 3600000);
  
          res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
              .status(200)
              .json(rest);
  
      } catch (error) {
          console.error("Error in Google Auth:", error);
          next(error);
      }
  };
  

  export const signout = (req,res)=>{
    res.clearCookie('access_token').status(200).json("Signout Success")
  }


  
  export const adminSignIn = async (req, res) => {
      const { email, password } = req.body;
  
      try {
          // Find admin by email and check if they are an admin
          const validAdmin = await User.findOne({ email, isAdmin: true });
          if (!validAdmin) {
              return res.status(404).json({ success: false, message: 'Admin not found!' });
          }
  
          // Compare passwords
          const validPassword = await bcryptjs.compare(password, validAdmin.password);
          if (!validPassword) {
              return res.status(401).json({ success: false, message: 'Wrong credentials!' });
          }
  
          // Generate JWT token
          const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
          // Remove password from response
          const { password: hashedPassword, ...rest } = validAdmin._doc;
  
          // Set expiry time
          const expiryDate = new Date(Date.now() + 3600000); // 1 hour
  
          // Set cookie
         // Set cookie
res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || true, // Set to true regardless of environment
    sameSite: 'Lax', // Change to 'Lax' for development
    expires: expiryDate,
});
          console.log('rest///',rest)
          // Send success response
// In your adminSignIn function - still set the cookie but also return the token
return res.status(200).json({ success: true, admin: rest, token });  
      } catch (error) {
          console.error('Admin sign-in error:', error);
          return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
  };
  