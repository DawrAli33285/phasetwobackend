const express=require('express')
let {getindivisualjob,getBookmark}=require('../../controllers/User/jobs');
let {pdfmulter,pdfsharp,picturemulter,sharppic}=require('../../filehandlers/filehandler')
let {createJobApplicants,getTermsangpolicy,getPrivacycontent,getPicLink,uploadCv,contactus,applyNow,getHomeContent}=require('../../controllers/User/jobs')
const router = require('../Admin/jobroute');
const { auth } = require('../../middleware/auth');
const route=express.Router();
route.post('/indivisual-job',getindivisualjob)
router.post('/application',pdfmulter.single('pdf'),pdfsharp,createJobApplicants)
router.post('/contact-us',contactus)
router.get('/apply/:id',auth,applyNow)
router.post('/getPicLink',picturemulter.single("image"),sharppic,getPicLink)
router.post('/uploadCv',picturemulter.single("image"),sharppic,auth,uploadCv)
router.get('/getHomeContent',getHomeContent)
router.get('/getPrivacycontent',getPrivacycontent)
router.get('/getTermsangpolicy',getTermsangpolicy)
router.get('/getBookmarks',auth,getBookmark)
module.exports=route