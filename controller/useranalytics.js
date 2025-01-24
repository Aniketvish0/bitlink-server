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
            $match: { _id: userID } // Match the user by ID
        },
        {
            $lookup: {
                from: "urls", // Collection to join
                foreignField: "userId", // Field in 'urls' collection
                localField: "_id", // Field in 'users' collection
                as: "urls", // Alias for the joined data
            }
        },
        {
            $addFields: {
                totalVisitorCount: {
                    $sum: {
                        $map: {
                            input: "$urls", // Iterate over the joined 'urls'
                            as: "url",
                            in: {
                                $add: [
                                    { $ifNull: ["$$url.directVisits.totalCount", 0] }, // Use directVisits.totalCount
                                    { $ifNull: ["$$url.qrVisits.totalCount", 0] } // Use qrVisits.totalCount
                                ]
                            }
                        }
                    }
                },
                totalUrls: { $size: "$urls" } // Count of total URLs
            }
        },
        {
            $project: {
                username: 1,
                totalVisitorCount: 1,
                totalUrls: 1,
                urls: {
                    $map: {
                        input: "$urls", // Iterate over the joined 'urls'
                        as: "url",
                        in: {
                            shortID: "$$url.shortID",
                            redirectURL: "$$url.redirectURL",
                            visitorCount: {
                                $add: [
                                    { $ifNull: ["$$url.directVisits.totalCount", 0] }, // Correctly reference directVisits.totalCount
                                    { $ifNull: ["$$url.qrVisits.totalCount", 0] } // Correctly reference qrVisits.totalCount
                                ]
                            },
                            isActive: "$$url.isActive"
                        }
                    }
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