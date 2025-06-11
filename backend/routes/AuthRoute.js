const express=require("express");
const router=express.Router();
const {login}=require("../controllers/AuthController");
const {register}=require("../controllers/AuthController");
const {logout}=require("../controllers/AuthController");

router.post("/login",login);
router.post("/register",register);
router.post("/logout",logout);

module.exports=router;
