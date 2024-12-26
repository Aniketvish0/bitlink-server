import { generateHash } from "6bithash";
import { getZooNumber } from "../Zookeeper/zookeeper.js";
import URL from "../models/url.js";
async function handleGeneratenewShortURL(req, res) {
    const body = req.body;
    if (!body.redirectURL) {
        return res.status(400).json({ error: "Please provide a redirect URL." });
    }
    try {
        const zooNumber = await getZooNumber();
        const shortID = generateHash(zooNumber);
        await URL.create({
            shortID: shortID,
            redirectURL: body.redirectURL,
            visitHistory: [],
        });
        return res.json({ id: shortID });
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
export {
    handlegetanalytics,
    handleGeneratenewShortURL,
}