import User from "../models/userModel.js"
import errorHandling from "../utils/error.js"
import bcryptjs from "bcryptjs"

export const test = (req,res)=>{
    res.json({message : "Api Is Working"})
}


export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandling(403, "Unauthorized"));
  }

  try {
    const updateFields = {};
    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.password) {
      updateFields.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.profilePicture) updateFields.profilePicture = req.body.profilePicture; // ✅ Ensure profile picture updates

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);

  } catch (error) {
    console.error(error);
    next(errorHandling(500, "Something went wrong"));
  }
};

export const deleteUser = async (req,res,next)=>{
  if(req.params.id !== req.user.id){
    return next(errorHandling(401,'You can delete only your account'))
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...')
    
  } catch (error) {
    
  }
}