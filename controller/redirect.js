import URL from "../models/url.js";
export async function handleredirecturl(req, res) {
    const shortID = req.params.shortID;
    if (!shortID) {
        return res.status(400).json({ error: "Please provide a short URL ID." });
    }
    try {
        const entry = await URL.findOneAndUpdate(
            { shortID: shortID },
            { $push: { visitHistory: { timestamp: Date.now(), ip: req.ip } } },
            { new: true }
        );
        if (!entry) {
            return res.status(404).json({ error: "Short URL not found." });
        }
        res.redirect(entry.redirectURL);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}