import express from "express";
import {
     handleusersignup , 
     handleuserlogin , 
     handleuserlogout , 
     handlerefreshAccessToken,
     handleupdateuser,
     handlechangepassword
} from "../controller/user.js";
import { authenticateToken , restrictedTo } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", handleusersignup);
router.post("/login", handleuserlogin);
router.post("/logout",authenticateToken,handleuserlogout);
router.get("/refreshtoken",authenticateToken ,handlerefreshAccessToken);
router.patch("/changepassword",authenticateToken, handlechangepassword);
router.patch("/updateaccountdetails", authenticateToken, handleupdateuser);
export default router;