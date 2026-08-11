import { firestore } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  Timestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { auth } from './firebase';
import { isUserAdmin } from './admin';

export interface Material {
  id: string;
  title: string;
  courseName: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  createdAt: Timestamp;
  semester?: string;
}

const COLLECTION = 'materials';

// Get all materials
export const getMaterials = async (): Promise<Material[]> => {
  try {
    const q = query(collection(firestore, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const materials: Material[] = [];
    snapshot.forEach((doc) => {
      materials.push({ id: doc.id, ...doc.data() } as Material);
    });
    return materials;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

// Upload a new material (admin only — use admin.createMaterial instead)
export const uploadMaterial = async (data: Omit<Material, 'id' | 'createdAt'>) => {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Only admins can upload materials');

  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to upload materials');

  const docRef = await addDoc(collection(firestore, COLLECTION), {
    ...data,
    uploadedBy: user.email || 'Anonymous',
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const deleteMaterialFromCollection = async (id: string) => {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Only admins can delete materials');

  await deleteDoc(doc(firestore, COLLECTION, id));
};