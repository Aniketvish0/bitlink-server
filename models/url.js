const mongoose = require('mongoose');
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
            datetime: {
                type: Date,
                default: Date.now
            },
            counts: {
                type: Number,
                default: 0
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

module.exports = URL; 