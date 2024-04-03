const cloudinary = require('cloudinary').v2;
const path=require('path')
const fs=require('fs')
// Configuration 
cloudinary.config({
  cloud_name:"dbjwbveqn",
  api_key: "774241215571685",
  api_secret: "ysIyik3gF03KPDecu-lOHtBYLf8"
});


module.exports.cloudinaryUploadImage=async(filetoUpload)=>{
  try{
   
   const data=await cloudinary.uploader.upload(filetoUpload,{
       resource_type:'auto'
   })
   console.log(data.url)
    return {
      url:data.secure_url
    }
}catch(e){
  console.log(e.message)
return e
}
}


module.exports.cloudinaryUploadPdf=async(filetoUpload)=>{
  try{
    const dirPathnew = path.join('public', 'files', 'pdf');
    console.log(dirPathnew)
   const data=await cloudinary.uploader.upload(path.join(dirPathnew, filetoUpload),{
       resource_type:'auto'
   })
   
    return {
      url:data.secure_url
    }
}catch(e){
return e
}
}