const cloudinary = require('cloudinary').v2;

const multer = require('multer-storage-cloudinary')

const v2= cloudinary.v2

const CloudinaryStorage = multer.CloudinaryStorage

cloudinary.config({
    cloud_name: 'dcic8nag2',
    api_key: '816378684148592',
    api_secret: 'd6NLgOSWf6bWtAHLmyNxEpGV_M8'
})

const storage = new CloudinaryStorage ({
 cloudinary,
 params: {
   folder:'spotify',
   allowedFormats:['jpg','png','jpeg']
 }
})

module.exports ={
    cloudinary,
    storage
}