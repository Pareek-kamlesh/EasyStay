import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('photos'); // Get all uploaded photos

    const urls = [];

    // Iterate through the files and upload them to Cloudinary
    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer()); // Convert file to buffer

        // Upload each file to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'easystay/hostel_photos' }, // Specify folder
            (error, result) => {
              if (error) return reject(error); // Handle upload errors
              resolve(result); // Resolve the result
            }
          );

          stream.end(buffer); // Write buffer to the stream
        });

        // Add the secure URL to the list
        if (uploadResult?.secure_url) {
          urls.push(uploadResult.secure_url);
        }
      }
    }

    // Return the uploaded URLs
    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json(
      { error: 'File upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
