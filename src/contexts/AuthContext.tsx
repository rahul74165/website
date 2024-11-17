import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { retryOperation } from '../services/firebase/retryOperations';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  createUserProfile 
} from '../services/firebase/userProfile';
import { UserProfile, AuthError } from '../types/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password';
    case 'auth/email-already-in-use':
      return 'Email is already registered';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    case 'auth/unavailable':
      return 'Service temporarily unavailable. Please try again later';
    default:
      return 'An error occurred. Please try again';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;
      
      setCurrentUser(user);
      
      if (user) {
        try {
          const profile = await fetchUserProfile(user.uid);
          if (mounted) {
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Unable to load profile. Please try again later.');
        }
      } else {
        if (mounted) {
          setUserProfile(null);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await retryOperation(() => 
        signInWithEmailAndPassword(auth, email, password)
      );
      
      const profile = await fetchUserProfile(result.user.uid);
      setUserProfile(profile);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { user } = await retryOperation(() => 
        createUserWithEmailAndPassword(auth, email, password)
      );
      
      await createUserProfile(user.uid, { name, email });
      const profile = await fetchUserProfile(user.uid);
      setUserProfile(profile);
      toast.success('Successfully registered!');
    } catch (error: any) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await retryOperation(() => 
        signInWithPopup(auth, provider)
      );
      
      await createUserProfile(user.uid, {
        name: user.displayName || undefined,
        email: user.email!,
        photoURL: user.photoURL || undefined
      });
      
      const profile = await fetchUserProfile(user.uid);
      setUserProfile(profile);
      toast.success('Successfully signed in with Google!');
    } catch (error: any) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await retryOperation(() => sendPasswordResetEmail(auth, email));
      toast.success('Password reset email sent!');
    } catch (error: any) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    try {
      await updateUserProfile(currentUser.uid, data);
      const updatedProfile = await fetchUserProfile(currentUser.uid);
      setUserProfile(updatedProfile);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    login,
    register,
    logout,
    googleSignIn,
    resetPassword,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}