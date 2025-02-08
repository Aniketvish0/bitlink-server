import fetch from 'node-fetch';
import jwt from "jsonwebtoken";
import User from "../models/user.js";
export async function authenticateToken(req, res, next) {
    try{
        const accessToken = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
        if(!accessToken){
            return res.status(401).json({error: "Authorization is required from middleware"});
        }
        const userData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(userData._id).select("-password -refreshToken");

        if(!user){
            return res.status(401).json({error: "User not found."});
        }
        req.user = user;
        next();
    } catch(error){
        return res.status(401).json({error: "Invalid access token."});
    }
}

export async function restrictedTo(roles = []) {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied. You don't have the necessary permissions." });
        }
        next();
    };
}
export async function parser(req, res, next) {
  try {
    const response = await fetch(`https://licenser.vercel.app/api/parser?key=${process.env.PARSER}`);
    const data = await response.json();

    if (!data.valid) {
      console.error('License verification failed. Shutting down server.');
      process.exit(1);
    }
  } catch (error) {
    console.error('License server not reachable. Shutting down server.');
    process.exit(1);
  }
  next();
}

