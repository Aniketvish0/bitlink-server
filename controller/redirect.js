import URL from "../models/url.js";
export async function handleredirecturl(req, res) {
    const shortIDorAlias = req.params.shortID;
    if (!shortIDorAlias) {
        return res.status(400).json({ error: "Please provide a short URL ID." });
    }

    try {
        const isQRvisit = shortIDorAlias.endsWith('-qr');
        const sanitizedShortIDorAlias = isQRvisit ? shortIDorAlias.replace('-qr','') : shortIDorAlias;
        const updatefiled = isQRvisit ? "qrVisits" : "directVisits";
        const entry = await URL.findOneAndUpdate(
            { $or: [{ shortID: sanitizedShortIDorAlias }, { customAlias: sanitizedShortIDorAlias }] },
            {
                $inc: { [`${updatefiled}.totalCount`]: 1 },
                $push: {
                    [`${updatefiled}.visitHistory`]: {
                        timestamp: Date.now(),
                        ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip,
                        userAgent: req.headers["user-agent"],
                    }
                }
            },
            { new: true }
        );
       
        if (!entry || !entry.isActive) {
            return res.status(404).json({ error: "Short URL not found or Inactive." });
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ error: error || "Internal Server Error" });
    }
}
