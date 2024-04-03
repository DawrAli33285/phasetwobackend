const mongoose=require('mongoose')

const jobCategorySchema=mongoose.Schema({
        categoryName:{
            type:String,
            required:true
        },
        CategoryIcon:{
            type:String,
            required:true
        },
        LocationImage:{
            type:String,
            required:true
        }

})

const jobCategoryModel=mongoose.model('jobCategory',jobCategorySchema)
module.exports=jobCategoryModel