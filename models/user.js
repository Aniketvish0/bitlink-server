import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    refreshToken: {
        type: String,
    },
    urls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "URL"
    }]
},
{ timestamps: true }
);
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    // the password is hashed before saving it to the database
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generateRefreshToken = function() {
    const token = jwt.sign({ 
        _id: this._id,
    }, 
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REDRESH_TOKEN_EXPIRATION_TIME });
    return token;
}

userSchema.methods.generateAccessToken = function() {
    const token = jwt.sign({ 
        _id: this._id,
        username: this.username,
     }, 
     process.env.ACCESS_TOKEN_SECRET, 
     { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME });
    return token;
}
const user = mongoose.model('User', userSchema);

export default user;
