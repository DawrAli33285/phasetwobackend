//importing 

const express=require('express')
const app=express()
const connection=require('./connection/connection')
const cors=require('cors')
const userroute=require('./routes/User/jobroute')
const adminpostroutes=require('./routes/Admin/jobroute')
const userAuthRoutes=require('./routes/User/auth')

//middleware
require('dotenv').config()
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({
    extended: true
    }));
app.use(cors())

//admin routes

app.use(adminpostroutes)


//user route
app.use(userAuthRoutes)
app.use(userroute)

//connection to database

connection

//listening to port

app.listen(process.env.PORT,()=>{
    console.log("backend working")
})