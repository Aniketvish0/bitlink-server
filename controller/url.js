import { generateHash } from "6bithash";
import { getZooNumber } from "../Zookeeper/zookeeper.js";
import URL from "../models/url.js";
import User from "../models/user.js";
import mongoose from "mongoose";
async function handleGeneratenewShortURL(req, res) {
    try {
        const {redirectURL , customAlias , isActive} = req.body;
        const userid = req.user?._id;
        if(!userid){
            return res.status(401).json({error: "access denied , No User Found"});
        }
        if (!redirectURL) {
            return res.status(400).json({ error: "Please provide a redirect URL." });
        }
        if(customAlias){
            const aliasExists = await URL.findOne({customAlias : customAlias});
            if(aliasExists){
                return res.status(400).json({error: "Alias already exists"});
            }
        }
        const zooNumber = await getZooNumber();
        const shortID = generateHash(zooNumber);
        const url = await URL.create({
            shortID: shortID,
            customAlias : customAlias !== undefined ? customAlias : "",
            isActive: isActive !== undefined ? isActive : false,
            redirectURL: redirectURL,
            userId: userid,
            visitHistory: [],
        });
        const user = await User.findByIdAndUpdate(
            userid, {
            $push: {
                urls: url._id,
            },
        });
        return res.json({ shortID: shortID , message : "Short URL created successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" , message: error.message });
    }
}

async function handlegetanalytics(req, res) {
    const shortID = req.params.shortID;
    if (!shortID) {
        return res.status(400).json({ error: "Please provide a short URL ID." });
    }
    try {
        const shortIDdoc = await URL.findOne({shortID});
        if (!shortIDdoc) {
            return res.status(404).json({ error: "Short URL not found." });
        }
        return res.json({
            totalclicks : shortIDdoc.visitHistory.length,
            analytics : shortIDdoc.visitHistory
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" , message: error.message });
    }
}
async function handledeleteurl(req, res){
    try{
        const userID = req.user._id;
        const { urlID } = req.body;
        if(!userID){
            return res.status(401).json({error: "access denied , No User Found"});
        }
        if (!urlID) {
            return res.status(400).json({ error: "Please provide a short URL ID." });
        }
        const existingUserURL = await URL.findOne({
            _id: urlID,
            user: userID,
        });
        console.log("Matching URL:", existingUserURL);
        
        // const existingUserURL = await URL.findOneAndDelete(
        //    {_id: urlID,}
        // );
        // console.log(existingUserURL);
        if(!existingUserURL){
            return res.status(404).json({ error: "Short URL not found or not belong to user" });
        }
        const user = await User.findByIdAndUpdate(userID, {
            $pull: {
                url: new mongoose.Types.ObjectId(urlID),
            },
        });
        return res.status(200).json({ message: "Short URL deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" , message: error.message });
    }        
}
export {
    handlegetanalytics,
    handleGeneratenewShortURL,
    handledeleteurl
}