import { useEffect, useState } from 'react';
import { firestore } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp, where } from 'firebase/firestore';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Timestamp;
  category?: string; // 'General' | 'Academic' | 'Event' | 'Urgent'
  priority?: 'low' | 'medium' | 'high';
}

export const useAnnouncements = (category?: string) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    let q;
    if (category) {
      q = query(
        collection(firestore, 'announcements'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(collection(firestore, 'announcements'), orderBy('createdAt', 'desc'));
    }
    
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

    return unsubscribe;
  }, [category]);

  return { announcements, loading, error };
};