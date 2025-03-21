// import express from 'express' ;
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import userRoutes from './routes/userRoutes.js';
// import authRoutes from './routes/authRoute.js';

// dotenv.config();

// mongoose.connect(process.env.MONGO).then(()=>{
//     console.log("db connected succesfully");
// }).catch((err)=>{
//     console.log(err);
// })

// const app=express();
// app.use(express.json());
// app.listen(3000,()=>{
//     console.log("listening on port number localhost:3000");
// });


// // api route 
// app.use("/api/user",userRoutes);
// app.use("/api/auth",authRoutes);


// app.use((err,req,res,next)=>{
//     const statusCode=err.statusCode ||500 ;
//     const message=err.message||'internal sever Error';
//     return res.status(statusCode).json({
//         success:false,
//          message,
//         statusCode,
//     });
// });
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoute.js';
// import cloudinaryRoutes from './routes/cloudinaryRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

// Configure Cloudinary
cloudinary.config({  // ❌ Fix: Remove `.v2` here
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
  console.log('Listening on port localhost:3000');
});
app.use(cors());
app.use(cors({
    origin: 'http://localhost:5174', // Allow only your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow credentials like cookies
  }));

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Cloudinary Signature API (for secure uploads)
// app.post('/api/cloudinary-signature',cloudinaryRoutes)
app.post('/api/cloudinary-signature', (req, res) => {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = cloudinary.utils.api_sign_request( // ❌ Fix: Remove `.v2`
        { timestamp,folder  },
        process.env.VITE_CLOUDINARY_API_KEY
      );
      res.json({ timestamp, signature,folder });
    } catch (error) {
      res.status(500).json({ message: 'Cloudinary signature generation failed', error });
    }
  });

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
