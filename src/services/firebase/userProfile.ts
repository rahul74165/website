import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { retryOperation } from './retryOperations';
import { UserProfile } from '../../types/auth';
import toast from 'react-hot-toast';

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const result = await retryOperation(async () => {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        // If profile doesn't exist, create a default one
        const defaultProfile: Partial<UserProfile> = {
          email: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(userDocRef, defaultProfile);
        return { id: uid, ...defaultProfile } as UserProfile;
      }
      
      return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    }, {
      maxRetries: 5,
      initialDelay: 1000,
      maxDelay: 10000
    });

    return result;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (error instanceof Error) {
      toast.error(`Failed to load profile: ${error.message}`);
    }
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    await retryOperation(async () => {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }, {
      maxRetries: 3,
      initialDelay: 1000
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    if (error instanceof Error) {
      toast.error(`Failed to update profile: ${error.message}`);
    }
    throw error;
  }
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    await retryOperation(async () => {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }, {
      maxRetries: 3,
      initialDelay: 1000
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    if (error instanceof Error) {
      toast.error(`Failed to create profile: ${error.message}`);
    }
    throw error;
  }
}