// Run this once to make your first user an admin
// 1. Log in to the app
// 2. Copy your UID from Profile screen
// 3. Run this script or use Firebase Console

import { firestore } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const makeUserAdmin = async (uid: string) => {
  const userRef = doc(firestore, 'users', uid);
  await updateDoc(userRef, { isAdmin: true });
  console.log('User is now admin:', uid);
};