import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dummy_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'dummy_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy_api_secret',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'prepfusion_resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw', // needed for non-image files like PDF in cloudinary
  },
});

export const upload = multer({ storage: storage });
export default cloudinary;
