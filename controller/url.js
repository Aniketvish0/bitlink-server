import { generateHash } from "6bithash";
import { getZooNumber } from "../Zookeeper/zookeeper.js";
import URL from "../models/url.js";
import User from "../models/user.js";
async function handleGeneratenewShortURL(req, res) {
    try {
        const { redirectURL, customAlias, isActive } = req.body;
        const userId = req.user?._id;

        if (!redirectURL) {
            return res.status(400).json({ error: "Please provide a redirect URL." });
        }

        if (customAlias) {
            const aliasExists = await URL.findOne({ customAlias });
            if (aliasExists) {
                return res.status(400).json({ error: "Alias already exists" });
            }
        }

        const zooNumber = await getZooNumber();
        const shortID = generateHash(zooNumber);

        const url = await URL.create({
            shortID,
            redirectURL,
            customAlias: customAlias || null,
            isActive: isActive,
            userId,
            directVisits: { totalCount: 0, visitHistory: [] },
            qrVisits: { totalCount: 0, visitHistory: [] },
            qrCode : {
                imageData : `${shortID}-qr`,
            }
        });

        await User.findByIdAndUpdate(userId, {
            $push: { urls: url?._id },
        });

        return res.json({ shortID, message: "Short URL created successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

async function handlegetanalytics(req, res) {
    const shortID = req.params.shortID;

    if (!shortID) {
        return res.status(400).json({ error: "Please provide a short URL ID." });
    }

    try {
        const shortIDdoc = await URL.findOne({ shortID });
        if (!shortIDdoc) {
            return res.status(404).json({ error: "Short URL not found." });
        }

        return res.json({
            directvisits: shortIDdoc.directVisits,
            qrvisits: shortIDdoc.qrVisits,
            fulldoc : shortIDdoc
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

async function handledeleteurl(req, res){
    try{
        const userID = req.user._id;
        const shortID = req.params.shortID;
        if(!userID){
            return res.status(401).json({error: "access denied , No User Found"});
        }
        if (!shortID) {
            return res.status(400).json({ error: "Please provide a short URL ID." });
        }
        const existingUserURL = await URL.findOne({
            shortID: shortID,
            userId: userID,
        });

        if(!existingUserURL){
            return res.status(404).json({ error: "Short URL not found or not belong to user" });
        }
        await User.findByIdAndUpdate(userID, {
            $pull: { urls: existingUserURL._id },
        });
        await URL.findByIdAndDelete(existingUserURL._id);

        return res.status(200).json({ message: "Short URL deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" , message: error.message });
    }        
}

async function handletoggleurlstatus(req, res, ) {
     try{
        const userID = req.user._id;
        const { shortID } = req.body;
        if(!userID){
            return res.status(401).json({error: "access denied, No User Found"});
        }
        if (!shortID) {
            return res.status(400).json({ error: "Please provide a short URL ID." });
        }
        const existingUserURL = await URL.findOne({
            shortID: shortID,
            userId: userID,
        });
        if(!existingUserURL){
            return res.status(404).json({ error: "Short URL not found or not belong to user" });
        }
        existingUserURL.isActive = !existingUserURL.isActive;
        await existingUserURL.save();
        return res.status(200).json({ message: "Short URL status updated successfully" });
        
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" , message: error.message });
    }
}
async function handleupdateurl(req, res){
   try{
        const { shortID } = req.body;
        const { redirectURL, isActive, customAlias } = req.body;
        if(!shortID){
            return res.status(400).json({ error: "Please provide a short URL ID." });
        }
        const existingURL = await URL.findOne({shortID: shortID});
        if(!existingURL){
            return res.status(404).json({ error: "Short URL not found" });
        }
        if(customAlias){
            const aliasExists = await URL.findOne({customAlias : customAlias, _id: { $ne: existingURL._id}});
            if(aliasExists){
                return res.status(400).json({error: "Alias already exists"});
            }
            existingURL.customAlias = customAlias;
        }
        if(redirectURL){existingURL.redirectURL = redirectURL}
        if(isActive){existingURL.isActive = isActive}
        await existingURL.save();
        return res.status(200).json({ message: "Short URL updated successfully" });
    }catch(e){
    return res.status(500).json({ error: "Internal Server Error" , message: error.message });
   }
}

async function handlegetallurlbyuser(req, res){
    try{
    const userID = req?.user?._id;
    if(!userID){
        return res.status(401).json({error: "access denied, No User Found"});
    }
    const urls = await URL.find({userId: userID});

    return res.status(200).json({urls: urls, message: "Url's fetched successfully"});
   }catch(error){
    return res.status(500).json({ error: error, message: "Internal Server Error" });
   } 
}


export {
    handlegetanalytics,
    handleGeneratenewShortURL,
    handledeleteurl,
    handletoggleurlstatus,
    handleupdateurl,
    handlegetallurlbyuser
}