const userjobmodel=require('../../models/common/jobModel')
let {cloudinaryUploadPdf,cloudinaryUploadImage}=require('../../filehandlers/cloudinary')
let applicantmodel=require('../../models/User/applicant')
const usermodel=require('../../models/User/user')
const mailgun = require("mailgun-js");
const path=require('path')
const contactusmodel=require('../../models/User/contactus')

const termsandconditionsmodel=require('../../models/common/termsandconditions')
const homemodel=require('../../models/common/home')
const privacymodel=require('../../models/common/privacy')
module.exports.getindivisualjob=async(req,res)=>{
   let {id}=req.body;

    try{
        // Log the request body
        // Accessing key and value
        const keys = Object.keys(req.body);
        const key = keys[0]; // Assuming there's only one key in the object
        const value = req.body[key];
      

        let response = await userjobmodel.findById(key); // Assuming you're using the key as the ID
        
        return res.status(200).json(response);
    }catch(e){
        console.log(e)
        return res.status(400).json({
            
            error:"Server error please try later"
        })
    }
}


module.exports.createJobApplicants=async(req,res)=>{
console.log("HI")
let {address,
    email_address,
    name,
    phone_number
    }=req.body
    try{
let pdfurl=await cloudinaryUploadPdf(req.filename)
await applicantmodel.create({
    email_address,
    address,
    name,
    phone_number,
    cv:pdfurl.url

})
return res.status(200).json({
    message:"application sent successfully"
})
    }catch(e){
console.log(e.message)
return res.status(400).json({
    error:"Server error please try later"
})        
    }
}

module.exports.contactus=async(req,res)=>{
    let {name,
    email,
    phone_number,
    company_name,message}=req.body;
    console.log(req.body)
    try{
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
            <p>Hello,</p>
            <p>I recently had the opportunity to engage with your services and I wanted to share my feedback.</p>
            <blockquote>"${message}"</blockquote>
          </div>
          <div>
            <p>I hope you find this feedback useful for your ongoing efforts to improve your services.</p>
            <p>Best regards,<br>${name}</p>
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
	from: email,
	to: "shahg33285@gmail.com",
	subject: "Contact Us",
	html:emailHtmlContent
};

mg.messages().send(data,async function (error, body) {
	console.log(body);
     if(!error){
      await contactusmodel.create({
        name,
        email,
        phone_number,
        company_name,
        message
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
        console.log(e.message)
return res.status(400).json({
    error:"Server error please try later"
})        
    }
}


 module.exports.applyNow=async(req,res)=>{
  let {id}=req.params;
  try{
    let userid=req.user.user._id
let checkcv=await usermodel.findOne({email:req.user.user.email}).lean();
if(checkcv.cv=="Example"){
  return res.status(400).json({
    error:"Please upload or create cv to apply"
  })
}

let response=await userjobmodel.findByIdAndUpdate(id,{
$push:{appliedBy:userid}
})
return res.status(200).json({
  message:"SUCESS"
})
  }catch(e){
     console.log(e.message)
return res.status(400).json({
    error:"Server error please try later"
})       
  }
 }


 module.exports.getPicLink=async(req,res)=>{
  try{
    const dirPath = path.join('public', 'files', 'images');

    const piclink = await cloudinaryUploadImage(path.join(dirPath, req.filename));
return res.status(200).json({
  link:piclink 
})

  }catch(e){
    console.log(e.message)
return res.status(400).json({
    error:"Server error please try later"
})      
  }
 }


 module.exports.uploadCv=async(req,res)=>{

  try{
    const dirPath = path.join('public', 'files', 'images');

    const piclink = await cloudinaryUploadImage(path.join(dirPath, req.filename));
   
await usermodel.findByIdAndUpdate(req.user.user._id,{
 cv:piclink.url
})
return res.status(200).json({
  message:'sucess'
})
  }catch(e){
    console.log(e.message)
return res.status(400).json({
    error:"Server error please try later"
})    
  }
 }

 module.exports.getHomeContent=async(req,res)=>{
  try{
let content=await homemodel.findOne({})
return res.status(200).json({
  content
})
  }catch(e){
    console.log(e.message)
    return res.status(400).json({
        error:"Server error please try later"
    })    
  }
 }


 module.exports.getPrivacycontent=async(req,res)=>{
  try{
    let content=await privacymodel.findOne({})
    return res.status(200).json({
      content
    })
      }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try later"
        })    
      }
 }


 module.exports.getTermsangpolicy=async(req,res)=>{
  try{
    let content=await termsandconditionsmodel.findOne({})
    return res.status(200).json({
      content
    })
      }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try later"
        })    
      }
 }

 module.exports.getBookmark=async(req,res)=>{
  try{
let data=await userjobmodel.find({ bookmark:req.user.user._id})
return res.status(200).json({
  data
})
  }catch(e){
    console.log(e.message)
    return res.status(400).json({
        error:"Server error please try later"
    })   
  }
 }

 module.exports.removeBookmark=async(req,res)=>{
let {id}=req.params;
  try{
await userjobmodel.findByIdAndUpdate(id,{
  $pull:{bookmark:req.user.user._id}
})
return res.status(200).json({
  message:"SUCESS"
})
  }catch(e){
    console.log(e.message)
    return res.status(400).json({
        error:"Server error please try later"
    })   
  }
 }