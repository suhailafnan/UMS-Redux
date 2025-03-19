import express from 'express' ;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoute.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("db connected succesfully");
}).catch((err)=>{
    console.log(err);
})

const app=express();
app.use(express.json());
app.listen(3000,()=>{
    console.log("listening on port number localhost:3000");
});


// api route 
app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes);


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode ||500 ;
    const message=err.message||'internal sever Error';
    return res.status(statusCode).json({
        succsess:false,
         message,
        statusCode,
    });
});
