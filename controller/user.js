import User from "../models/user.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(error);
    }
};

export async function handleusersignup(req, res) {
    try {
        const { username, email, password , fullname } = req.body;
        if (!username ||!email ||!password ||!fullname) {   
            return res
            .status(400)
            .json({ error: "Please provide all required fields." });
        }
        const Userexists = await User.findOne({
            $or: [{ username }, { email }],
        });
    
        if (Userexists) {
            return res
            .status(400)
            .json({ error: "User already exists." });
        }
        const newUser = await User.create({
            username : username.toLowerCase(),
            fullname : fullname.toLowerCase(),
            email, 
            password 
        });
    
        const createduser = await User.findById(newUser._id).select('-password -refreshToken');
        if (!createduser) {
            return res
           .status(500)
           .json({ error: "Failed to create user." });
        }
        return res
        .status(201)
        .json( { 
            user : createduser,
            message: "User created successfully." 
        });
        
    } catch (e) {
        return res.status(e.statusCode || 500).json( { error: e.message || "Error in user registration" });
    }
}

export async function handleuserlogin(req, res) {
    try {
        const { username, password } = req.body;
        if (!username ||!password) {
            return res
           .status(400)
           .json({ error: "Please provide username and password." });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res
           .status(401)
           .json({ error: "Invalid email or password." });
        }
        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return res
           .status(401)
           .json({ error: "Invalid email or password." });
        }
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
        const loggedinUser = await User.findById(user._id).select("-password -refreshToken");
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        };
        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);
        return res.status(200).json({user: loggedinUser, accessToken , refreshToken, message: "User logged in successfully."});
    }
    catch (e) {
        return res.status(e.statusCode || 500).json( { error: e.message || "Error in user login" });
    }  
}

export async function handleuserlogout(req, res) {
    try{
        const userID = req.user._id;
        const user = await User.findByIdAndUpdate(
            userID,
            { $unset:
                 { refreshToken: 1 }
            }, 
            { new: true }
        );
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        };
        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);
        return res.status(200).json({ message: "User logged out successfully." });
    } catch (e) {
        return res.status(e.statusCode || 500).json( { error: e.message || "Error in user logout" });
    }    
}

export async function handlerefreshAccessToken(req, res) {
    try{ 
        const incomingrefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!incomingrefreshToken) {
            return res.status(403).json({ error: "No refresh token provided." });
        }
        const decodedUser = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedUser?._id);
        if (!user ||!user?.refreshToken || user?.refreshToken!== incomingrefreshToken) {
            return res.status(403).json({ error: "Invalid or expired refresh token." });
        }
        
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        };
        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return res.status(200).json({ user: user, accessToken, refreshToken, message: "Access token refreshed successfully." });
        
    } catch (e) {   
        return res.status(e.statusCode || 500).json( { error: e.message || "Error in refreshing access token" });
    }
}

export async function handlechangepassword(req, res) {
    try{
        const{ oldPassword, newPassword }= req.body;
        const userID = req.user._id;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const isPasswordCorrect = await User.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid old password." });
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });
        return res.status(200).json({ message: "Password updated successfully." });
    }
    catch(e){
        return res.status(e.statusCode || 500).json( { error: e.message || "Error in forgot password" });
    }
}

export async function handleupdateuser(req, res) {
    try {
        const { fullName , username, email } = req.body;

        if (!fullName || !email || !username) {
            return res.status(400).json({ error: "Please provide all required fields." });
        }
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
            _id: { $ne: req.user._id },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Email or username already exists." });
        }
        const id = req.user._id;
        const user = await User.findByIdAndUpdate(
            id,
            { fullName, email, username },
            { new: true }
        ).select("-password -refreshToken");

        return res.status(200).json({ user : user ,message : "User updated successfully"});
    } catch (e) {
        res.status(e.statusCode || 500).json({ error: e.message || "Error in updating user" });
    }
} 