import URL from "../models/url.js";
export async function handleredirecturl(req, res) {
    const shortIDorAlias = req.params.shortID;
    if (!shortIDorAlias) {
        return res.status(400).json({ error: "Please provide a short URL ID." });
    }
    try {
        const entry = await URL.findOneAndUpdate(
            { $or: [{ shortID : shortIDorAlias }, { customAlias : shortIDorAlias }]} ,
            { $push: { 
                visitHistory: { 
                    timestamp: Date.now(), 
                    ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip, 
                    userAgent : req.headers["user-agent"],
                }
              } 
            },
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