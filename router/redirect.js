import { Router } from "express";
import { handleredirecturl } from "../controller/redirect.js";

const router = Router();

router.get("/:shortID", handleredirecturl);

export default router;