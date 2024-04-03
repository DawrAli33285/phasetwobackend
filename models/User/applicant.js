const mongoose=require('mongoose')

const application=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email_address:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    cv:{
        type:String,
        required:true
    }
})

const applicantmodel=mongoose.model('applicant',application)
module.exports=applicantmodel