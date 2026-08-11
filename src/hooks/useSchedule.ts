import { useEffect, useState } from 'react';
import { firestore } from '../services/firebase';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';

export interface ScheduleItem {
  id: string;
  courseName: string;
  instructor: string;
  location: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  createdAt: Timestamp;
}

const DAY_ORDER: Record<string, number> = {
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
  'Sunday': 7
};

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const colRef = collection(firestore, 'schedule');
    
    const unsubscribe = onSnapshot(colRef, 
      (snapshot) => {
        const data: ScheduleItem[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as ScheduleItem);
        });
        // Sort by day and time
        const sorted = data.sort((a, b) => {
          const dayDiff = (DAY_ORDER[a.dayOfWeek] || 99) - (DAY_ORDER[b.dayOfWeek] || 99);
          if (dayDiff !== 0) return dayDiff;
          return a.startTime.localeCompare(b.startTime);
        });
        setSchedule(sorted);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Schedule listener error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { schedule, loading, error };
};