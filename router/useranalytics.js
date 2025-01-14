import express from 'express';
import { userAnalytics } from '../controller/useranalytics.js';
import { authenticateToken } from '../middlewares/auth.js';
const router = express.Router();

router.get('/analytics',authenticateToken, userAnalytics);

export default router;