import express from "express";
import { handleGeneratenewShortURL , handlegetanalytics} from "../controller/url.js";
const router = express.Router();

router.post('/', handleGeneratenewShortURL);
router.get('/analytics/:shortID', handlegetanalytics);
export default router;