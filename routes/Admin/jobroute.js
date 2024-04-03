const express=require('express')
const router=express.Router();
const uploadMiddleware = require('../../filehandlers/multiplefile'); // Import as default export
const {auth}=require('../../middleware/auth')
const {createJob,updateJob,sendEmail,getApplicants,addBookmark,inserthomecontent,getContactEmail,insertPrivacy,insertTermsandconditions,gethomepagedata,getIndivisualJob,getCategoryJobs,getCategories,jobDelete,createCategory,updatePost,getTotalJobsByCompany,getApplications,getJobPosts}=require('../../controllers/Admin/jobs')
const {picturemulter,sharppic,sharpmultipic}=require('../../filehandlers/filehandler')
router.get('/getContactUsEmails',getContactEmail)
router.post('/sendEmail',sendEmail)
router.get('/getApplicants/:id',getApplicants)
router.post('/create-jobpost',picturemulter.single("image"),sharppic,createJob);
router.delete('/delete-post/:id',jobDelete)
router.post('/update-jobpost',picturemulter.single("company_logo"),sharppic,updatePost);
router.get('/get-jobposts',getJobPosts)
router.get('/get-applications',getApplications)
router.get('/get-jobdata',getTotalJobsByCompany)
router.post('/create-category', picturemulter.fields([{ name: 'category_icon', maxCount: 1 }, { name: 'location_image', maxCount: 1 }]),sharpmultipic,createCategory);
router.get('/get-category',getCategories)
router.get('/get-homepagedata',gethomepagedata)
router.get('/getCategoryJobs',getCategoryJobs)
router.get('/getindivisualjob/:id',getIndivisualJob)
router.get('/addBookmark/:id',auth,addBookmark)

router.post('/insertTermsandconditions',insertTermsandconditions)
router.post('/insertPrivacy',insertPrivacy)
router.post('/inserthomecontent',picturemulter.single("Banner_Image"),sharppic,inserthomecontent)
router.post('/updateJob',updateJob)


module.exports=router;