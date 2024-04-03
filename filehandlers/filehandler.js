const multer=require('multer')
const sharp=require('sharp')
const fs=require('fs')

const path=require('path')
const memoryStorage=multer.memoryStorage();
const  multerfilter=(req,file,cb)=>{
  
    if(file.mimetype.startsWith('image')){
        return cb(null,true)
    }else{
        return cb({message:'invalid file format'},false)
    }
}
const  profilefilter=(req,file,cb)=>{
  
    return cb(null,true)
}
let pdffilter=(req,file,cb)=>{

    if (file.mimetype === 'application/pdf') {
        return cb(null,true)
    }else{
        return cb({message:'invalid file format'},false)
    }
}

const pdfmulter=multer({
    storage:memoryStorage,
    fileFilter:pdffilter
})


const picturemulter=multer({
    storage:memoryStorage,
    fileFilter:multerfilter,
    limits:{fileSize:1000000}
})

const profilemulter=multer({
    storage:memoryStorage,
    fileFilter:profilefilter
})

const pdfsharp=async(req,res,next)=>{
   
    try{
        const dirPathnew = path.join('public', 'files', 'pdf');
        let pathexists=fs.existsSync(dirPathnew)   
        if(!pathexists){
            
            fs.mkdirSync(dirPathnew,{recursive:true})
        }
        
        req.filename = `pdf-${Date.now()}-${req.file.originalname}`;
    
        fs.writeFile(path.join(dirPathnew, req.filename), req.file.buffer, (err) => {
            if (err) {
                console.error('Error copying file:', err);
                return;
            }
            console.log('File copied successfully.');
        });
            // await sharp(req.file.buffer).toFormat('pdf').toFile(path.join(dirPathnew, req.filename));
           
      

next()
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:e.message
        })
    }
}


const sharppic=async(req,res,next)=>{
   
    
    const dirPath = path.join('public', 'files', 'images');

try{

   let pathexists=fs.existsSync(dirPath)   
if(!pathexists){
    fs.mkdirSync(dirPath,{recursive:true})
}
req.filename = `image-${Date.now()}-${req.file.originalname}`;
console.log('req'+req.filename)
    await sharp(req.file.buffer).toFormat('jpeg').jpeg({quality:90}).toFile(path.join(dirPath, req.filename));
   
next();
}catch(e){
   
    return res.status(400).json({
        error:e.message
    })
}
}

const sharpmultipic=async(req,res,next)=>{
       
    const dirPath = path.join('public', 'files', 'images');

    try{
        let pathexists=fs.existsSync(dirPath)   
        if(!pathexists){
            fs.mkdirSync(dirPath,{recursive:true})
        }
       
        req.category_icon = `image-${Date.now()}-${req.files.category_icon[0].originalname}`;
        req.location_image=`image-${Date.now()}-${req.files.location_image[0].originalname}`
 await sharp(req.files.category_icon[0].buffer).toFormat('jpeg').jpeg({quality:90}).toFile(path.join(dirPath, req.category_icon));
 await sharp(req.files.location_image[0].buffer).toFormat('jpeg').jpeg({quality:90}).toFile(path.join(dirPath,  req.location_image));
next();
}catch(e){
        return res.status(400).json({
            error:e.message
        })
    }
}
const sharpprofile = async (req, res, next) => {
    const dirPath = path.join('public', 'files', 'images');

    try {
        let pathexists = fs.existsSync(dirPath);
        if (!pathexists) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Process and save profile photo
        if (req.files && req.files.length > 0 && req.files[0].fieldname === 'profile_photo' && req.files[0].mimetype.startsWith('image')) {
            const profilePhotoFilename = `image-${Date.now()}-${req.files[0].originalname}`;
            await sharp(req.files[0].buffer).toFile(path.join(dirPath, profilePhotoFilename));
            req.profile_photo = profilePhotoFilename; // Store filename in request object
        }

        // Process and save CV
        if (req.files && req.files.length > 0 && req.files[0].fieldname === 'cv') {
            const cvFilename = `cv-${Date.now()}-${req.files[0].originalname}`;
            // Save the PDF file directly without processing with Sharp
            fs.writeFile(path.join(dirPath, cvFilename), req.files[0].buffer, (err) => {
                if (err) {
                    console.error('Error saving CV:', err);
                    return res.status(400).json({
                        error: 'Error saving CV'
                    });
                }
                console.log('CV saved successfully.');
            });
            req.cv = cvFilename; // Store filename in request object
        }

        next();
    } catch (e) {
        console.error('Error processing files:', e);
        return res.status(400).json({
            error: 'Error processing files'
        });
    }
};


module.exports={picturemulter,sharppic,pdfmulter,pdfsharp,sharpmultipic,profilemulter,sharpprofile}