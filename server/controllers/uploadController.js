const multer = require('multer')
const uploadController = require('express').Router()

//destination where the image will be saved
//filename -> what will be the name of the save image
const storage = multer.diskStorage({
    desgination:(req,file,cb) => {
        cb(null,'public/images')
    }
})

const upload = multer({
    storage
})

// upload.single ('image') is going to check in the req.body for the req.body.image
uploadController.post('/image',upload.single('image'),async(req,res) => {
    try{
        return res.status(200).json('File uploaded successfully !!!')
    }catch(error){
        console.error(error)
    }
})

module.exports = uploadController