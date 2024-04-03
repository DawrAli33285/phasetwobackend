const jwt=require('jsonwebtoken')

module.exports.auth=async(req,res,next)=>{
    try{
      
if(req.headers.authorization.startsWith('Bearer')){
    let token=req.headers.authorization.split(' ')[1]
let user=jwt.verify(token,process.env.jwt_key)
req.user=user
next();
}
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Auth error"
        })
    }
}