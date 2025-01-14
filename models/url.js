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
        sparse: true,
    },
    isActive:
    {
        type: Boolean,
        required: true,
        default: true,
    },
    visitorCount:
    {
        type: Number,
        required: true,
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

URLSchema.index(
    { customAlias: 1 },
    { unique: true, partialFilterExpression: { customAlias: { $exists: true, $ne: null } } }
);

const URL = mongoose.model('url', URLSchema);

export default URL;