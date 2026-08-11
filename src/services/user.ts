import { firestore } from './firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: Date;
}

// Save user data to Firestore (called after signup)
export const saveUserProfile = async (data: Partial<UserProfile>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  
  const userRef = doc(firestore, 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    ...data,
    updatedAt: new Date(),
  }, { merge: true });
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(firestore, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (data: Partial<UserProfile>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  
  const userRef = doc(firestore, 'users', user.uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date(),
  });
};