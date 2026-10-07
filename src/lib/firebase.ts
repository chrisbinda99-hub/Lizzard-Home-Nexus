import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfileData } from '../types/echse';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore
const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
export const db = getFirestore(app, databaseId);

// Master creator email matching user's account
export const MASTER_ACCOUNT_EMAIL = 'Chrisbinda99@gmail.com'.toLowerCase();

export const isMasterAccount = (email?: string | null): boolean => {
  if (!email) return false;
  return email.toLowerCase() === MASTER_ACCOUNT_EMAIL;
};

// Sign in with Google Popup
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

// Sign out
export const logOutGoogle = async (): Promise<void> => {
  await signOut(auth);
};

// Test connection on boot per Firebase guidelines
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    const testDocRef = doc(db, 'system', 'ping');
    await getDocFromServer(testDocRef);
    return true;
  } catch (err) {
    // Permission denied on non-existent or restricted doc is still a valid connection
    return true;
  }
};

// Cloud Profile Storage Helpers
export const saveUserProfileToCloud = async (userId: string, profile: UserProfileData, email?: string): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const cloudPayload = {
      ...profile,
      userId,
      email: email || '',
      isMaster: isMasterAccount(email),
      updatedAt: new Date().toISOString()
    };
    await setDoc(userDocRef, cloudPayload, { merge: true });
  } catch (error) {
    console.error('Error saving profile to Firestore:', error);
    throw error;
  }
};

export const loadUserProfileFromCloud = async (userId: string): Promise<UserProfileData | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    console.error('Error loading profile from Firestore:', error);
    return null;
  }
};
