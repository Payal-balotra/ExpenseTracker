const multer = require("multer");
const path = require("path");



const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    cb(null, "uploads/");
  },
  filename: (req, file, cb)=> {
    cb(null,`${Date.now()}-${path.extname(file.originalname)}`);
  } 
    
})

// file filter 

const filterFile = (req,file,cb) => {
    const allowedFileTypes = ["image/jpeg","image/jpg","image/png"];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error("Only .jpeg, .jpg and .png files are allowed"),false   );
    }
}

const upload = multer({ storage: storage, fileFilter: filterFile, limits:{fileSize:1024*1024*5} });

module.exports = upload;