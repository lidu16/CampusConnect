import { firestore } from './firebase';
import { collection, getDocs, orderBy, query, Timestamp, addDoc } from 'firebase/firestore';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Timestamp;
  category?: string; // e.g., "General", "Academic", "Event"
}

const COLLECTION = 'announcements';

// Fetch all announcements, ordered by creation date (newest first)
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const q = query(collection(firestore, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const announcements: Announcement[] = [];
    snapshot.forEach((doc) => {
      announcements.push({
        id: doc.id,
        ...doc.data(),
      } as Announcement);
    });
    return announcements;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

// (Optional) Add an announcement – we'll use this later for admin features
export const addAnnouncement = async (data: Omit<Announcement, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(firestore, COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding announcement:', error);
    throw error;
  }
};