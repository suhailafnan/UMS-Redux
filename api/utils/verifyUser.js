import jwt from "jsonwebtoken";
import errorHandling from "./error.js";

export const verifyToken = (req, res, next) => {
    console.log("Cookies:", req.cookies);
    const token = req.cookies.access_token;
    console.log("Token from cookie:", token);
    
    if (!token) return next(errorHandling(401, "You are not authenticated"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Token verification error:", err);
            return next(errorHandling(403, "Token is not valid"));
        }

        console.log("Verified user:", user);
        req.user = user;
        next();
    });
};
  
