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
    visitHistory: [
        {
            timestamp: {
                type: Number,
            },
            ip: {
                type: String
            }
        }
    ]
},
{timestamps: true}
);

const URL = mongoose.model('url', URLSchema);

export default URL;