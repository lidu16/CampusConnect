import { useEffect, useState } from 'react';
import { firestore } from '../services/firebase';
import { 
  collection, query, orderBy, onSnapshot, Timestamp,
  doc, getDoc, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove
} from 'firebase/firestore';
import { auth } from '../services/firebase';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  createdAt: Timestamp;
  attendees?: string[]; // Array of user UIDs
  capacity?: number;
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
          data.push({ id: doc.id, ...doc.data(), attendees: doc.data().attendees || [] } as Event);
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

// RSVP to an event
export const rsvpToEvent = async (eventId: string): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to RSVP');

  try {
    const eventRef = doc(firestore, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) throw new Error('Event not found');
    
    const attendees = eventDoc.data().attendees || [];
    
    if (attendees.includes(user.uid)) {
      // Already RSVP'd -> Cancel RSVP
      await updateDoc(eventRef, {
        attendees: arrayRemove(user.uid),
      });
      return false; // Canceled
    } else {
      // Add RSVP
      await updateDoc(eventRef, {
        attendees: arrayUnion(user.uid),
      });
      return true; // RSVP'd
    }
  } catch (error) {
    console.error('Error RSVPing:', error);
    throw error;
  }
};

// Check if user has RSVP'd
export const hasUserRSVPed = (event: Event): boolean => {
  const user = auth.currentUser;
  if (!user) return false;
  return (event.attendees || []).includes(user.uid);
};