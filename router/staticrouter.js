import express from "express";

const router = express.Router();
router.get("/", (req, res) => {
    res.send({corsOrigin: process.env.CORS_ORIGIN || "Environment variable not set"});
});

export default router;