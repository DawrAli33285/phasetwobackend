const {cloudinaryUploadImage}=require('../../filehandlers/cloudinary')
const adminjobmodel=require('../../models/common/jobModel')
const path=require('path')
const termsandconditionsmodel=require('../../models/common/termsandconditions')
const fs=require('fs')
const homemodel=require('../../models/common/home')
const mailgun = require("mailgun-js");
const usermodel=require('../../models/User/user')
const contactusmodel=require('../../models/User/contactus')
let categorymodel=require('../../models/common/jobCategory')
const privacymodel=require('../../models/common/privacy')
const applicationmodels=require('../../models/User/applicant')
module.exports.createJob=async(req,res)=>{
    
    const {
        company_name,
        category,
        job_title,
        deadline_date,
        salary,
        experience,
        job_description,
        job_responsibility,
        educational_requirements,
        extra_benefits,
        vacancy,
        city,
        country,
        job_type}=req.body;
   

    try{
        const dirPath = path.join('public', 'files', 'images');

        const logolink = await cloudinaryUploadImage(path.join(dirPath, req.filename));

          fs.unlinkSync(path.join(dirPath, req.filename))

await adminjobmodel.create({
job_title,
company_name,
company_logo:logolink.url,
experience_required:experience,
job_type:job_type,
job_description,
job_responsibility,
category,
deadline_date,
salary,
educational_requirements,
extra_benefits,
vacancy,
city,
country,
})

return res.status(200).json({
    "message":"sucessfully created"
})
    }catch(e){
    console.log(e.message)
        return res.status(400).json({
            error:"Server error please try later"
        })
    }
    
    
    }



    module.exports.jobDelete=async(req,res)=>{
      let {id}=req.params;
      console.log(id)
        try{
await adminjobmodel.findByIdAndDelete(id)
return res.status(200).json({
    message:"deleted successfully"
})
        }catch(e){
            console.log(e)
            return res.status(400).json({
                error:"Server error please try later"
            })
        }
    }



    module.exports.updatePost=async(req,res)=>{
        const {
            jobTitle,
            companyName,
            numberOfEmployees,
            servicesOffered,
            experienceRequired,
            jobType,
            jobDescription,id}=req.body;
        try{
            const dirPath = path.join('public', 'files', 'images');

            const logolink = await cloudinaryUploadImage(path.join(dirPath, req.filename));
      fs.unlinkSync(path.join(dirPath, req.filename))
     await adminjobmodel.findByIdAndUpdate(id,{
        job_title:jobTitle,
        company_name: companyName,
        company_logo:logolink.url,
    number_of_employees:parseInt(numberOfEmployees),
    services_offered:servicesOffered,
    experience_required:experienceRequired,
    job_type:jobType,
    job_description:jobDescription

      })
      return res.status(200).json({
        message:'job updated sucessfully'
      })

        }catch(e){
            console.log(e)
            return res.status(400).json({
                
                error:"Server error please try later"
            })
        }
    }




    module.exports.getJobPosts=async(req,res)=>{
        try{
let jobposts=await adminjobmodel.find({}).populate('category')
return res.status(200).json({
    jobposts
})
        }catch(e){
            console.log(e)
            return res.status(400).json({
                
                error:"Server error please try later"
            })  
        }
    }
    module.exports.getApplications = async (req, res) => {
        try {
            let response = await applicationmodels.find({});
            
            // Iterate over each response object and fetch PDF from Cloudinary URL
            for (let i = 0; i < response.length; i++) {
                const cloudinaryUrl = response[i].cv;
                const cloudinaryResponse = await fetch(cloudinaryUrl);
                const pdfBuffer = await cloudinaryResponse.arrayBuffer();
    
                // Convert Mongoose document to a plain JavaScript object
                const plainObject = response[i].toObject();
    
                // Assign PDF buffer to the plain JavaScript object
                plainObject.pdfBuffer = Array.from(new Uint8Array(pdfBuffer));
    
                // Replace the Mongoose document with the modified plain object
                response[i] = plainObject;
            }
            
            return res.status(200).json({
                response: response
            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({
                error: "Server error please try later"
            });
        }
    }
    

    module.exports.getTotalJobsByCompany=async(req,res)=>{
        console.log("trugger")
        try{
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1; 
            const companyPipeline = [
                {
                    $group: {
                        _id: '$company_name', // Renaming _id field to name
                        jobs: { $sum: 1 }    // Renaming total_jobs field to jobs
                    }
                },
                {
                    $project: {
                        name: '$_id', // Renaming _id field to name
                        jobs: 1       // Including jobs field
                    }
                }
            ];
           
const monthPipeline = [
    {
        $match: {
            $expr: {
                $and: [
                    { $eq: [{ $year: '$createdAt' }, currentYear] }, // Match year
                    { $lte: [{ $month: '$createdAt' }, currentMonth] } // Match month less than or equal to current month
                ]
            }
        }
    },
    {
        $group: {
            _id: { $month: '$createdAt' },
            jobs: { $sum: 1 } // Count the number of documents in each group
        }
    },
    {
        $project: {
            month: { $dateToString: { format: '%B', date: { $dateFromParts: { year: currentYear, month: '$_id' } } } }, // Convert month number to month name
            jobs: 1 // Keep the totalJobs field
        }
    },
    {
        $sort: { '_id': 1 } // Optionally, sort by month index
    }
];
            // const monthPipeline = [
            //     {
            //         $match: {
            //             $expr: {
            //                 $and: [
            //                     { $eq: [{ $year: '$created_at' }, currentYear] }, // Match year
            //                     { $lte: [{ $month: '$created_at' }, currentMonth] } // Match month less than or equal to current month
            //                 ]
            //             }
            //         }
            //     },
            //     {
            //         $group: {
            //             _id: { $month: '$created_at' },
            //             total_jobs: { $sum: 1 }
            //         }
            //     }
            // ];
    
            const [companyResult, monthResult] = await Promise.all([
            adminjobmodel.aggregate(companyPipeline),
        adminjobmodel.aggregate(monthPipeline)
            ]);
            const pibi = {
                company: companyResult,
                month: monthResult
            };
        console.log(pibi)
        return res.status(200).json({
            pibi
        })
        }catch(e){
            console.log(e)
            return res.status(400).json({
                
                error:"Server error please try later"
            })  
        }
    }

    function getMonthName(monthNumber) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[monthNumber - 1];
    }


    module.exports.createCategory = async (req, res) => {
  try{
    const dirPath = path.join('public', 'files', 'images');
    let { category_name } = req.body;

    // Upload images to Cloudinary and extract URLs
    const categoryIconCloudinaryResponse = await cloudinaryUploadImage(path.join(dirPath, req.category_icon));
    const locationImageCloudinaryResponse = await cloudinaryUploadImage(path.join(dirPath, req.location_image));
    const categoryIconUrl = categoryIconCloudinaryResponse.url;
    const locationImageUrl = locationImageCloudinaryResponse.url;

    // Create category in MongoDB
    await categorymodel.create({
        categoryName: category_name,
        CategoryIcon: categoryIconUrl,
        LocationImage: locationImageUrl
    });


            return res.status(200).json({
                message: "Category successfully created"
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    };









    module.exports.getCategories=async(req,res)=>{
        try{

        let response=await categorymodel.find({}).lean()
     
        return res.status(200).json({
            response
        })

        }catch(e){
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }

    module.exports.gethomepagedata = async (req, res) => {
        try {

            const totalCompanies = await adminjobmodel.aggregate([
                { $group: { _id: '$company_name' } },
                { $count: 'totalCompanies' }
            ]);
            // Get total number of applies
            const totalApplies = await adminjobmodel.aggregate([
                { $match: { appliedBy: { $exists: true, $ne: [] } } }, // Filter jobs with non-empty appliedBy array
                { $group: { _id: null, total: { $sum: { $size: '$appliedBy' } } } } // Group and sum the size of appliedBy array
            ]);
    
            // Extract total number of applies from aggregation result
            const totalAppliesCount = totalApplies.length > 0 ? totalApplies[0].total : 0;
            const totalusers=await usermodel.find({}).count();


            // Group jobs by category
            let categoryjobs = await adminjobmodel.aggregate([
                { $group: { _id: '$category', img_url: { $first: '$company_logo' }, jobs: { $sum: 1 } } }
            ]).exec();
    
            // Get all jobs
            let jobs = await adminjobmodel.find({}).limit(1).lean();
    
            // Group jobs by location
            let jobsaccordingtolocation = await adminjobmodel.aggregate([
                { $group: { _id: { country: '$country', city: '$city' }, img_url: { $first: '$company_logo' }, jobs: { $sum: 1 } } }
            ]).exec();
    
            let data = {
                jobs,
                jobsaccordingtolocation,
                categoryjobs,
                totalusers,
                totalAppliesCount,
                totalCompanies
            };
    
            return res.status(200).json({
                data
            });
    
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    };
    module.exports.getCategoryJobs = async (req, res) => {
        try {
            let categoryJobs = await categorymodel.aggregate([
                { $lookup: { from: 'adminjobmodel', localField: 'categoryName', foreignField: 'category', as: 'jobs' } },
                { 
                    $project: { 
                        categoryName: 1, 
                        
                        CategoryIcon: "$CategoryIcon", // Rename img_url to CategoryIcon
                        jobsCount: { $size: '$jobs' } 
                    } 
                }
            ]).exec();
    
            return res.status(200).json({
                categoryJobs
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }
    


    module.exports.getIndivisualJob=async(req,res)=>{
       let {id}=req.params;
        try{
let jobdata=await adminjobmodel.findById(id)
return res.status(200).json({
    jobdata
})
        }catch(e){
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }
    
    module.exports.addBookmark = async (req, res) => {
        let { id } = req.params;
        let userId = req.user.user._id;
        try {
            // Check if the user ID already exists in the bookmark array
            const job = await adminjobmodel.findById(id);
            const isBookmarked = job.bookmark.includes(userId);
    
            if (isBookmarked) {
                // If the user ID exists, remove it
                await adminjobmodel.findByIdAndUpdate(id, {
                    $pull: { bookmark: userId }
                });
                return res.status(200).json({
                    message: 'Bookmark removed'
                });
            } else {
                // If the user ID doesn't exist, add it
                await adminjobmodel.findByIdAndUpdate(id, {
                    $addToSet: { bookmark: userId }
                });
                return res.status(200).json({
                    message: 'Bookmark added'
                });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }

    

    module.exports.insertTermsandconditions=async(req,res)=>{
      let {introduction,Information_We_Collect,Use_of_Information,Disclosure_of_Information}=req.body;
        try{
let exists=await termsandconditionsmodel.find({}).lean();
if(exists){
await termsandconditionsmodel.updateOne({},{
    introduction,
        Information_We_Collect,
        Use_of_Information,
        Disclosure_of_Information
})
}else{
    await termsandconditionsmodel.create({
        introduction,
        Information_We_Collect,
        Use_of_Information,
        Disclosure_of_Information
    })
}
return res.status(200).json({
    message:"Sucess"
})
        }catch(e){
  console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }


    module.exports.insertPrivacy=async(req,res)=>{
       let { introduction,
       Information_We_Collect,
       Use_of_Information,
       Disclosure_of_Information}=req.body;
        try{
            let alreadyExists=await privacymodel.findOne({})
            if(alreadyExists){
                await privacymodel.create({
                    introduction,
                    Information_We_Collect,
                    Use_of_Information,
                    Disclosure_of_Information
                })
            }else{
                await privacymodel.updateOne({},{
                    introduction,
                    Information_We_Collect,
                    Use_of_Information,
                    Disclosure_of_Information
                })
            }

return res.status(200).json({
    message:"Sucess"
})
        }catch(e){
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }


    module.exports.inserthomecontent=async(req,res)=>{
      let {    Banner_Sub_Heading,
        Banner_Content,
        Jobs_Category_List_Heading,
        Jobs_Category_List_Content,
        Featured_Job_List_Heading,
        Featured_Job_List_Content,
        Total_Recruiters,
        Daily_User_Visited,
        Daily_Job_Posted,
        Phone_Number,
        Instagram_Link,
        Facebook_Link,
        LinkedIn_Link,
        Twitter_Link}=req.body;
        try{
            const dirPath = path.join('public', 'files', 'images');

    const piclink = await cloudinaryUploadImage(path.join(dirPath, req.filename));
   
let alreadyExists=await homemodel.findOne({})
if(alreadyExists){
await homemodel.updateOne({},{ Banner_Sub_Heading,
    Banner_Content,
    Jobs_Category_List_Heading,
    Jobs_Category_List_Content,
    Featured_Job_List_Heading,
    Featured_Job_List_Content,
    Total_Recruiters,
    Daily_User_Visited,
    Daily_Job_Posted,
    Phone_Number,
    Instagram_Link,
    Facebook_Link,
    LinkedIn_Link,
    Twitter_Link,
    Banner_Image:piclink.url
})
}else{
    await homemodel.create({
        Banner_Sub_Heading,
      Banner_Content,
      Jobs_Category_List_Heading,
      Jobs_Category_List_Content,
      Featured_Job_List_Heading,
      Featured_Job_List_Content,
      Total_Recruiters,
      Daily_User_Visited,
      Daily_Job_Posted,
      Phone_Number,
      Instagram_Link,
      Facebook_Link,
      LinkedIn_Link,
      Twitter_Link,
      Banner_Image:piclink.url
     })
}
return res.status(200).json({
    message:"SUCESS"
})
        }catch(e){
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }



    module.exports.getContactEmail=async(req,res)=>{
        try{
let response=await contactusmodel.find({})
return res.status(200).json({
    response
})
        }catch(e){
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }

    module.exports.sendEmail=async(req,res)=>{
        try{
let {id,message}=req.body;
const emailHtmlContent = `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
  }
  .container {
    max-width: 600px;
    margin: auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  .header {
    color: #333;
    text-align: center;
  }
  .review {
    background-color: #f9f9f9;
    border-left: 4px solid #007BFF;
    margin: 20px 0;
    padding: 20px;
    border-radius: 4px;
  }
  .rating {
    text-align: right;
    font-size: 18px;
    font-weight: bold;
    color: #ff9500;
  }
</style>
</head>
<body>

<div class="container">
  <div class="header">
    <h2>Contact Us</h2>
  </div>
  <div class="review">
    <p>${message}</p>
    
  </div>

</div>

</body>
</html>

`;
// const DOMAIN = "sandbox6e19418c37bb4a548087fa3058c59f0c.mailgun.org";
// const mg = mailgun({apiKey: "ee5ba270ebbd07f68ed5cc3ec63a6e44-2c441066-07687140", domain: DOMAIN});
// const data = {
// 	from: email,
// 	to: "shahg33285@gmail.com",
// 	subject: "Contact Us",
// 	html:emailHtmlContent
// };
const DOMAIN = "sandbox6a6c1146404048379fe04e593d00be67.mailgun.org";
const mg = mailgun({apiKey: "fb6c7a836dd23a28c5fc1dde55a1a060-408f32f3-f5c88aff", domain: DOMAIN});
const data = {
from: "lemightyeagle@gmail.com",
to: "shahg33285@gmail.com",
subject: "Contact Us",
html:emailHtmlContent
};

mg.messages().send(data,async function (error, body) {
console.log(body);
if(!error){
await contactusmodel.findByIdAndUpdate(id,{
    status:"answered"
})
return res.status(200).json({
    message:'sucess'
})
}else{
console.log(error)
return res.status(400).json({
    message:error
})
}
});
        }catch(e){
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }


    module.exports.getApplicants=async(req,res)=>{
        try{
            let {id}=req.params;
            console.log(id)
            let applicants = await adminjobmodel.findOne({ _id: id }).populate({
                path: 'appliedBy',
                model: 'user',
                select: 'name email mobile_number city state country post_code key_skills main_qualifications profile_photo cv',
              }).exec();
            
return res.status(200).json({
applicants    
})
        }catch(e){
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }



    module.exports.updateJob=async(req,res)=>{
        const {
            company_name,
            job_title,
            job_type,
            job_description,
   id
        }=req.body;
   console.log(id)
        try{
let response=await adminjobmodel.findByIdAndUpdate(id,{
    company_name,
job_title,
job_type,
job_description
})
return res.status(200).json({
    response
})
        }catch(e){
            console.log(e);
            return res.status(500).json({
                error: "Server error, please try again later"
            });
        }
    }