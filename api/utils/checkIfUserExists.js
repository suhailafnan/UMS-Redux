import User from "../models/userModel.js";


export const checkIfUserExists = async (req, res, next) => {
    const { email } = req.body;  // Assuming email is sent in the request body

    try {
        // Check if user already exists in the database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists!" });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};