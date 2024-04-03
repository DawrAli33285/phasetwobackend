const mongoose=require('mongoose')

const contactusSchema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    message:{
        type:String
    },
    phone_number:{
        type:Number
    },
    company_name:{
        type:String
    },
    status:{
        type:String,
        default:'unanswered'
    }
})

const contactusmodel=mongoose.model('contactus',contactusSchema)
module.exports=contactusmodel