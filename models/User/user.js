const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
type:String,
required:true
},

mobile_number:{
    type:String,
    required:true
},
city:{
type:String,
required:true
},
state:{
    type:String,
    required:true
},
country:{
    type:String,
    required:true
},
post_code:{
    type:String,
    required:true
},
key_skills:{
    type:[String],
    required:true
},
main_qualifications:{
    type:[{
       level_of_education:String,
       field_of_study:String

    }],
    required:true
},
profile_photo:{
    type:String,
    required:true
  
},
cv:{
    type:String,
    required:true
}
})

const usermodel=mongoose.model('user',userSchema)

module.exports=usermodel