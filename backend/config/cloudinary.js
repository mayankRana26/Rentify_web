// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rentify',
    resource_type: 'auto', // 'auto' image aur video dono ko handle kar leta hai
    allowed_formats: ['jpeg', 'png', 'jpg', 'mp4', 'mov', 'avi'], // Allowed formats badha diye
  },
});

const upload = multer({ storage: storage });

export default upload;