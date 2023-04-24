import { v2 as cloudinary } from 'cloudinary';

export function init() {

    // Configuration 
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('cloudinary initialized');
}


export async function upload(image, folder, name) {

    // Upload

    const res = await cloudinary.uploader.upload(image, {public_id: `${folder}/${name}`})

    return res.secure_url;
   
}