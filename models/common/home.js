const mongoose=require('mongoose')
const homeSchema=mongoose.Schema({
    Banner_Sub_Heading:{
        type:String,
        default:"To The Make Sure JobOpportunity."
    },
    Banner_Content:{
        type:String,
        default:"2400 Peoples are daily search in this portal, 100 user added job portal!"
    },
    Jobs_Category_List_Heading:{
        type:String,
        default:'Jobs Category List'
    },
    Jobs_Category_List_Content:{
        type:String,
        default:"To choose your trending job dream & to make future bright."
    },
    Featured_Job_List_Heading:{
        type:String,
        default:"Featured Job List Heading,"
    },
    Featured_Job_List_Content:{
        type:String,
        default:"Featured Job List Content"
    },
    Total_Recruiters:{
        type:String,
        default:"Total Companies"
    },
    Daily_User_Visited:{
        type:String,
        default:"Total Users"
    },
    Daily_Job_Posted:{
        type:String,
        default:"Total Applies"
    },
    Phone_Number:{
        type:String,
        default:"+099-035 7398 3465"
    },
    Instagram_Link:{
        type:String,
        default:"Instagram Link"
    },
    Facebook_Link:{
        type:String,
        default:"Facebook Link"
    },
    LinkedIn_Link:{
        type:String,
        default:"LinkedIn Link"
    },
    Twitter_Link:{
        type:String,
        default:"Twitter Link"
    },
    Banner_Image:{
    type:String,
    default:"http://localhost:3001/static/media/anty.6755db436b93e0e65918.png"
    }
})
const homemodel=mongoose.model('home',homeSchema)
module.exports=homemodel
