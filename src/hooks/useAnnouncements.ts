import { useEffect, useState } from 'react';
import { firestore } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Timestamp;
  category?: string;
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, 'announcements'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data: Announcement[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Announcement);
        });
        setAnnouncements(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Announcements listener error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe; // Cleanup on unmount
  }, []);

  return { announcements, loading, error };
};