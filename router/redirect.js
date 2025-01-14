import express from "express";
import { handleredirecturl } from "../controller/redirect.js";

const router = express.Router();

// Redirecting user to the original URL when they visit the shortened URL while tracking the visitors history
router.get("/:shortID", handleredirecturl);

export default router;