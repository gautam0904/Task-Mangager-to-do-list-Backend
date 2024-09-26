import multer from "multer";

const storage = multer.diskStorage({
    destination : function(req : any , file : any , cb : Function){
        cb(null , "./public/Temp");
    },
    filename : function(req , file , cb){
        cb(null , file.originalname)
    }
});

export const upload = multer({
    storage
});