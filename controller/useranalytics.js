import URL from "../models/url.js";
import User from "../models/user.js";

const userAnalytics = async(req, res) => {
   try{   
      const userID = req?.user?._id;
      if(!userID){
         return res.status(401).json({error: "Access denied, No User Found"});
      }
        const response = await User.aggregate([
            {
                $match:
                {
                    _id: userID,
                }
            },
            {
                $lookup:
                {
                    from: "urls",
                    foreignField: "userId",
                    localField: "_id",
                    as: "Url",
                }
            },
            {
                $addFields: {
                    totalVisitorCount: { $sum: "$Url.visitorCount" }, // Sum of all visitor counts
                    totalUrls: { $size: "$Url" } // Count of total URLs
                }
            },
            {
                $project:
                {
                    username: 1,
                    totalVisitorCount: 1,
                    totalUrls: 1,
                    Url: {
                        shortID: 1,
                        redirectURL: 1,
                        visitorCount: 1,
                        isActive: 1
                    }
                }
            }
        ]);

        return res.status(200).json({Response : response, Message : "User details fetched successfully"});
    }
    catch(e){
     return res.status(e.statusCode || 500).json({ error: e.message || "Error in getting user analytics" });
   }   
}

export {userAnalytics};