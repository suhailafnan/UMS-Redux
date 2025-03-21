import express from 'express' ;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoute.js';
import adminRoutes from './routes/adminRoutes.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("db connected succesfully");
}).catch((err)=>{
    console.log(err);
})

const app = express();
app.use(express.json());
app.use(cookieParser());



// // api route 
app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes);
app.use('/api/admin', adminRoutes);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode ||500 ;
    const message=err.message||'internal sever Error';
    return res.status(statusCode).json({
        success:false,
         message,
        statusCode,
    });
});

app.listen(3000,()=>{
    console.log("listening on port number localhost:3000");
});





