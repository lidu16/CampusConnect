import { firestore } from './firebase';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { auth } from './firebase';
import { isSuperAdminEmail } from '../config/admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
  createdAt?: Date;
}

const requireCurrentUserAdmin = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in');

  const profile = await getUserProfile(user.uid);
  if (!profile?.isAdmin) {
    throw new Error('Only admins can perform this action');
  }
};

export const saveUserProfile = async (data: Partial<UserProfile>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  const userRef = doc(firestore, 'users', user.uid);
  const existing = await getDoc(userRef);
  const email = user.email || data.email || '';
  const isSuperAdmin = isSuperAdminEmail(email);

  const profileData: Record<string, unknown> = {
    uid: user.uid,
    email: user.email,
    updatedAt: new Date(),
  };

  if (!existing.exists()) {
    profileData.isAdmin = isSuperAdmin;
    profileData.createdAt = new Date();
  }

  // Super admin is always admin on every login
  if (isSuperAdmin) {
    profileData.isAdmin = true;
  }

  if (data.displayName !== undefined) profileData.displayName = data.displayName;
  if (data.photoURL !== undefined) profileData.photoURL = data.photoURL;

  await setDoc(userRef, profileData, { merge: true });
};

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

export const updateUserProfile = async (data: Partial<UserProfile>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  const { isAdmin: _ignored, ...safeData } = data;
  const userRef = doc(firestore, 'users', user.uid);
  await updateDoc(userRef, {
    ...safeData,
    updatedAt: new Date(),
  });
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  await requireCurrentUserAdmin();

  try {
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);
    const users: UserProfile[] = [];
    snapshot.forEach((docSnap) => {
      users.push({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
    });
    return users.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const grantAdminRole = async (uid: string): Promise<void> => {
  await requireCurrentUserAdmin();
  const userRef = doc(firestore, 'users', uid);
  await updateDoc(userRef, {
    isAdmin: true,
    updatedAt: new Date(),
  });
};

export const revokeAdminRole = async (uid: string): Promise<void> => {
  await requireCurrentUserAdmin();

  const currentUser = auth.currentUser;
  if (currentUser?.uid === uid) {
    throw new Error('You cannot revoke your own admin privileges');
  }

  const targetProfile = await getUserProfile(uid);
  if (isSuperAdminEmail(targetProfile?.email)) {
    throw new Error('Cannot revoke admin from the super admin account');
  }

  const userRef = doc(firestore, 'users', uid);
  await updateDoc(userRef, {
    isAdmin: false,
    updatedAt: new Date(),
  });
};

export const deleteUser = async (uid: string): Promise<void> => {
  await requireCurrentUserAdmin();

  const currentUser = auth.currentUser;
  if (currentUser?.uid === uid) {
    throw new Error('You cannot delete your own account');
  }

  const userRef = doc(firestore, 'users', uid);
  await deleteDoc(userRef);
};
