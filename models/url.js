import mongoose from "mongoose"

const VisitStatsSchema = new mongoose.Schema({
    totalCount: {
        type: Number,
        default: 0,
        required: true
    },
    visitHistory: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        ip: String,
        userAgent: String
    }]
}, { _id: false });

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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    customAlias: {
        type: String,
        sparse: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    
    directVisits: VisitStatsSchema,
    qrVisits: VisitStatsSchema,
    
    qrCode: {
        imageData: String,
        lastUpdated: {
           type: Date,
           default : Date.now
        }
    }
},
{
timestamps: true,
});


URLSchema.index(
    { customAlias: 1 },
    { unique: true, partialFilterExpression: { customAlias: { $exists: true, $ne: null } } }
);

URLSchema.index({ shortID: 1 });

URLSchema.index({ userId: 1, createdAt: -1 });

const URL = mongoose.model('url', URLSchema);

export default URL;