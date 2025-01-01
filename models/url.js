import mongoose from "mongoose"
const URLSchema = new mongoose.Schema({
    shortID: {
        type: String, 
        required: true,
        unique: true
    },
    redirectURL: {
        type: String, 
        required: true
    },
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    customAlias: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
    },
    isActive:
    {
        type: Boolean,
        required: true,
        default: true,
    },
    visitHistory: [
        {
            timestamp: {
                type: Date,
                default : Date.now()
            },
            ip: {
                type: String
            },
            userAgent: {
                type: String
            }
        }
    ]
},
{timestamps: true}
);

const URL = mongoose.model('url', URLSchema);

export default URL;