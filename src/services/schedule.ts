import { firestore } from './firebase';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';

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

const COLLECTION = 'schedule';

const DAY_ORDER: Record<string, number> = {
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
  'Sunday': 7
};

export const getSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    const q = query(collection(firestore, COLLECTION));
    const snapshot = await getDocs(q);
    const schedule: ScheduleItem[] = [];
    snapshot.forEach((doc) => {
      schedule.push({ id: doc.id, ...doc.data() } as ScheduleItem);
    });
    
    // Sort by day of week, then by start time
    return schedule.sort((a, b) => {
      const dayDiff = (DAY_ORDER[a.dayOfWeek] || 99) - (DAY_ORDER[b.dayOfWeek] || 99);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};