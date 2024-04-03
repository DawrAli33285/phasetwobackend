const mongoose=require('mongoose')

let connection=mongoose.connect('mongodb+srv://lemightyeagle:dmlQTmtoShhBWNAb@cluster0.ybd43zy.mongodb.net/jobpost?retryWrites=true&w=majority&appName=Cluster0')

module.exports=connection