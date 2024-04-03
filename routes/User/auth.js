const {register,login,getProfile,updateProfile}=require('../../controllers/User/auth')
const express=require('express')
const {auth}=require('../../middleware/auth')
const router=express.Router();
const {picturemulter,sharppic,profilemulter,sharpprofile}=require('../../filehandlers/filehandler')
router.post('/register',picturemulter.single("image"),sharppic,register)
router.post('/login',login)
router.get('/getProfile',auth,getProfile)
router.post('/updateProfile',profilemulter.any(),sharpprofile,auth,updateProfile)

module.exports=router