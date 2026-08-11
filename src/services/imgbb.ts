// Replace with your actual API key
const IMGBB_API_KEY = 'c28656cc24908b51e74f9a54feaaa0d7';

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  console.log('🔵 Uploading to ImgBB...');
  console.log('🔵 File:', file.name, file.size, file.type);

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('🔵 ImgBB response:', data);

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    console.log('🟢 Upload success! URL:', data.data.url);
    return data.data.url;
  } catch (error) {
    console.error('🔴 Upload error:', error);
    throw error;
  }
};