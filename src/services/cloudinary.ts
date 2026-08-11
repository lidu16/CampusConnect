// Your Cloudinary URL
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/c-3c8f57ac5994f62fc5fd77f42275b5/image/upload';
const UPLOAD_PRESET = 'campusconnect'; // ← Must match EXACTLY what you created

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};