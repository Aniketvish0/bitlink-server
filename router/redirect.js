import express from "express";
import { handleredirecturl } from "../controller/redirect.js";

const router = express.Router();

router.get("/:shortID", handleredirecturl);
export default router;