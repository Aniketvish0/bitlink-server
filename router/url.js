import express from "express";
import { handleGeneratenewShortURL , handlegetanalytics , handledeleteurl} from "../controller/url.js";
import { authenticateToken } from "../middlewares/auth.js";
const router = express.Router();

router.post('/',authenticateToken, handleGeneratenewShortURL);
router.post('/deleteurl', authenticateToken, handledeleteurl);
router.get('/analytics/:shortID', authenticateToken, handlegetanalytics);
export default router;