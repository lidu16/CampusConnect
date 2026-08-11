import { firestore } from './firebase';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;  // ← NEW: Admin flag
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
    isAdmin: false, // Default: not admin
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

// Get all users (Admin only)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);
    const users: UserProfile[] = [];
    snapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() } as UserProfile);
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Grant admin privileges to a user (Admin only)
export const grantAdminRole = async (uid: string): Promise<void> => {
  const userRef = doc(firestore, 'users', uid);
  await updateDoc(userRef, {
    isAdmin: true,
    updatedAt: new Date(),
  });
};

// Revoke admin privileges from a user (Admin only)
export const revokeAdminRole = async (uid: string): Promise<void> => {
  const userRef = doc(firestore, 'users', uid);
  await updateDoc(userRef, {
    isAdmin: false,
    updatedAt: new Date(),
  });
};

// Delete a user (Admin only)
export const deleteUser = async (uid: string): Promise<void> => {
  try {
    // Delete from Firestore
    const userRef = doc(firestore, 'users', uid);
    await deleteDoc(userRef);
    
    // Delete from Firebase Authentication
    // Note: This requires Admin SDK or Cloud Function
    // We'll handle this with a Cloud Function later
    console.log('User deleted from Firestore:', uid);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};