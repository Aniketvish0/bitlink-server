import express from "express";
import { handleGeneratenewShortURL, 
         handlegetanalytics, 
         handledeleteurl, 
         handletoggleurlstatus, 
         handleupdateurl, 
         handlegetallurlbyuser}
from "../controller/url.js";

import { authenticateToken } from "../middlewares/auth.js";
const router = express.Router();

router.post('/', authenticateToken, handleGeneratenewShortURL);
router.delete('/delete/:shortID', authenticateToken, handledeleteurl);
router.get('/analytics/:shortID', authenticateToken, handlegetanalytics);
router.post('/togglestatus',authenticateToken, handletoggleurlstatus);
router.patch('/update', authenticateToken, handleupdateurl);
router.get('/user-urls', authenticateToken, handlegetallurlbyuser);
export default router;