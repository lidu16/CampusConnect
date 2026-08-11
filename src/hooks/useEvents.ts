import { useEffect, useState } from 'react';
import { firestore } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  createdAt: Timestamp;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, 'events'), orderBy('date', 'asc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data: Event[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Event);
        });
        setEvents(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Events listener error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { events, loading, error };
};