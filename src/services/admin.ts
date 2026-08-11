import { firestore } from './firebase';
import { 
  collection, 
  addDoc, 
  Timestamp,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  where,
  getDoc
} from 'firebase/firestore';
import { auth } from './firebase';
import { getUserProfile } from './user';
import { isSuperAdminEmail } from '../config/admin';

// Check if the current user is admin
export const isUserAdmin = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  if (isSuperAdminEmail(user.email)) return true;

  try {
    const profile = await getUserProfile(user.uid);
    return profile?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get current admin status synchronously
export const getCurrentAdminStatus = (): boolean => {
  // This is used for UI components that can't use async
  // We'll store the admin status in a context
  return false; // Default
};

// --- Announcement Admin Functions ---

export const createAnnouncement = async (data: {
  title: string;
  content: string;
  category?: string;
  author: string;
}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in');
  
  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Only admins can create announcements');

  const docRef = await addDoc(collection(firestore, 'announcements'), {
    ...data,
    author: data.author || user.email || 'Admin',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// --- Event Admin Functions ---

export const createEvent = async (data: {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in');
  
  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Only admins can create events');

  const docRef = await addDoc(collection(firestore, 'events'), {
    ...data,
    attendees: [],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// --- Material Admin Functions ---

export const createMaterial = async (data: {
  title: string;
  courseName: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  semester?: string;
}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in');
  
  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Only admins can upload materials');

  const docRef = await addDoc(collection(firestore, 'materials'), {
    ...data,
    uploadedBy: data.uploadedBy || user.email || 'Admin',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// --- Delete Functions ---

export const deleteAnnouncement = async (id: string) => {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Only admins can delete announcements');
  
  await deleteDoc(doc(firestore, 'announcements', id));
};

export const deleteEvent = async (id: string) => {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Only admins can delete events');
  
  await deleteDoc(doc(firestore, 'events', id));
};

export const deleteMaterial = async (id: string) => {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Only admins can delete materials');
  
  await deleteDoc(doc(firestore, 'materials', id));
};

// --- Schedule Admin Functions ---

export const createScheduleItem = async (data: {
  courseName: string;
  instructor: string;
  location: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in');

  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Only admins can create schedule items');

  const docRef = await addDoc(collection(firestore, 'schedule'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const deleteScheduleItem = async (id: string) => {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Only admins can delete schedule items');

  await deleteDoc(doc(firestore, 'schedule', id));
};