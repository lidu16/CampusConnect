import { firestore } from './firebase';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // or Timestamp
  time: string;
  organizer: string;
  createdAt: Timestamp;
}

const COLLECTION = 'events';

export const getEvents = async (): Promise<Event[]> => {
  try {
    const q = query(collection(firestore, COLLECTION), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    const events: Event[] = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};