const usermodel=require('../../models/User/user')
const {cloudinaryUploadImage}=require('../../filehandlers/cloudinary')
const bcrypt=require('bcrypt')
const path=require('path')
const fs=require('fs')

const termsandconditionsmodel=require('../../models/common/termsandconditions')
const homemodel=require('../../models/common/home')
const privacymodel=require('../../models/common/privacy')
let jwt=require('jsonwebtoken')
module.exports.register=async(req,res)=>{
let {name,email,password,mobile_number,city,state,country,post_code,key_skills,level_of_education,field_of_study}=req.body
    try{
        let encryptedPassword=await bcrypt.hash(password,10)
        const dirPath = path.join('public', 'files', 'images');

        const profilePic = await cloudinaryUploadImage(path.join(dirPath, req.filename));
let alreadyexists=await usermodel.findOne({email})
if(alreadyexists){
    return res.status(400).json({
        error:'Email already in use'
    })
}
      
        await usermodel.create({
    name,
    email,
    cv:"Example",
    password:encryptedPassword,
    mobile_number,
    city,
    state,
    country,
    post_code,
    profile_photo:profilePic.url,
    main_qualifications:[{
        level_of_education:level_of_education,
        field_of_study:field_of_study
 
    }],
    key_skills:[key_skills]
})
let alreadyexistshomecontent=await homemodel.findOne({})
let alreadyexistsprivacycontent=await privacymodel.findOne({})
let alreadyexiststermscontent=await termsandconditionsmodel.findOne({})
if(!alreadyexistshomecontent){
    await homemodel.create({
        Banner_Sub_Heading:"To The Make Sure JobOpportunity.",
        Banner_Content:"2400 Peoples are daily search in this portal, 100 user added job portal!",
        Jobs_Category_List_Heading:"Jobs Category List",
        Jobs_Category_List_Content:"To choose your trending job dream & to make future bright.",
        Featured_Job_List_Heading:"Job By Your Location",
        Featured_Job_List_Content:"To choose your trending job dream & to make future bright.",
        Total_Recruiters:"Total Companies",
        Daily_User_Visited:"Total Users",
        Daily_Job_Posted:"Total Applies",
        Phone_Number:"+099-035 7398 3465",
        Instagram_Link:"Instagram Link",
        Facebook_Link:"Facebook Link",
        LinkedIn_Link:"LinkedIn Link",
        Link:'Twitter Link',
        Banner_Image:'http://localhost:3001/static/media/anty.6755db436b93e0e65918.png'
    })
}
if(!alreadyexistsprivacycontent){
    await privacymodel.create({
        introduction:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        Information_We_Collect:"1.1 Lorem Ipsum: is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Upon registering for our Platform, we may collect personal information such as your name, email address, postal address, phone number, and payment information through our third-party payment processor. Additional information may be gathered as you create your account or utilize our services.1.2 Lorem Ipsum: is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Upon registering for our Platform, we may collect personal information such as your name,",
        Use_of_Information:"1.2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.2.2 We is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        Disclosure_of_Information:"3.1 Your is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Upon registering for our Platform, we may collect personal information such as your name,3.2 Your is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of"
    })
}
if(!alreadyexiststermscontent){
    await termsandconditionsmodel.create({
        introduction:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        Information_We_Collect:"is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Upon registering for our Platform, we may collect personal information such as your name, email address, postal address, phone number, and payment information through our third-party payment processor. Additional information may be gathered as you create your account or utilize our services.",
        Use_of_Information:"1.2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 2.2 We is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
        Disclosure_of_Information:"3.1 Your is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Upon registering for our Platform, we may collect personal information such as your name,3.2 Your is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of"
    })
}
return res.status(200).json({
    message:"user sucessfully created"
})

    }catch(e){
        console.log('user registration error'+e.message)
return res.status(400).json({
    error:"Could not create user at the moment please try later"
})
    }
}


module.exports.login=async(req,res)=>{
    let {email,password}=req.body;
    try{
let user=await usermodel.findOne({email}).lean()
if(!user){
    return res.status(400).json({
        error:"Email not found"
    })
}
let passwordMatch=await bcrypt.compare(password,user.password)
if(passwordMatch){
    let token=await jwt.sign({
        user
    },process.env.JWT_KEY)
    return res.status(200).json({
        ...user,
        token
    })
}
    }catch(e){
        console.log('user login error'+e.message)
        return res.status(400).json({
            error:"Could not login user at the moment please try later"
        })
    }
}

module.exports.getProfile=async(req,res)=>{
    try{
     
let user=await usermodel.findOne({email:req.user.user.email})
return res.status(200).json({
    user
})
    }catch(e){
        console.log('user login error'+e.message)
        return res.status(400).json({
            error:"Could not login user at the moment please try later"
        })
    }
}



module.exports.updateProfile = async (req, res) => {
    let passwordchanged = false;
    let {
        name,
        country,
        state,
        city,
        post_code,
        profile_photo,
        cv,
        field_of_study,
        level_of_education,
        email,
        password,
        mobile_number,
        key_skills
    } = req.body;

    console.log(field_of_study)
    console.log(level_of_education)
    let bycryptedpassword = password;
    if (bycryptedpassword) {
        passwordchanged = true;
        bycryptedpassword = await bcrypt.hash(password, 10);
    }

    try {
        const dirPath = path.join('public', 'files', 'images');

        let profilephoto;
        if (profile_photo == undefined) {
            profilephoto = await cloudinaryUploadImage(path.join(dirPath, req.profile_photo));
            let newcvlink=profilephoto.url
            profilephoto=newcvlink
        }else{
            profilephoto=profile_photo
        }

        let cvlink;
        if (cv == undefined || cv!='Example') {
            cvlink = await cloudinaryUploadImage(path.join(dirPath, req.cv));
       let newcvlink=cvlink.url
       cvlink=newcvlink
        }else{
            cvlink=cv;
        }
    
        let updatedProfileData = {
            name,
            email,
            country,
            state,
            profile_photo:profilephoto,
            cv:cvlink,
            city,
            post_code,
            password: passwordchanged ? bycryptedpassword : password,
            main_qualifications: [{
        field_of_study,
        level_of_education,
            }],
            key_skills,
            mobile_number
        };

    

        // Update the user model
        // let updated = await usermodel.findByIdAndUpdate(req.user.user._id, updatedProfileData);
console.log(updatedProfileData)        
        return res.status(200).json({
            message: "success"
        });
    } catch (e) {
        console.log('user login error' + e.message);
        return res.status(400).json({
            error: "Could not update profile at the moment, please try again later"
        });
    }
};