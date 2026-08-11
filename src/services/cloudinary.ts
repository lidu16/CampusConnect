const CLOUDINARY_CLOUD_NAME = 'c-3c8f57ac5994f62fc5fd77f42275b5';
const UPLOAD_PRESET = 'campusconnect';

export type UploadFile =
  | File
  | { uri: string; name: string; type: string };

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
const RAW_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip', 'rar'];

function getFileMeta(file: UploadFile): { name: string; mime: string } {
  if ('uri' in file) {
    return { name: file.name, mime: file.type };
  }
  return { name: file.name, mime: file.type };
}

function getResourceType(file: UploadFile): 'image' | 'raw' | 'auto' {
  const { name, mime } = getFileMeta(file);
  if (mime.startsWith('image/')) return 'image';

  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  if (RAW_EXTENSIONS.includes(ext)) return 'raw';
  return 'auto';
}

export const uploadImageToCloudinary = async (file: UploadFile): Promise<string> => {
  const resourceType = getResourceType(file);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();

  if ('uri' in file) {
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);
  } else {
    formData.append('file', file);
  }

  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.error?.message || `Upload failed (${response.status})`;
    throw new Error(message);
  }

  return data.secure_url as string;
};
