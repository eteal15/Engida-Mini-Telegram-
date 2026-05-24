import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Define the robust Error handler types conforming to FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Lazy initialization & Safety check
const isMockPlaceholder = firebaseConfig.apiKey.includes('MockAPIKeyPlaceHolder');

// Initialize Firebase App gracefully
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Gracefully check and log connection
export async function testConnection() {
  if (isMockPlaceholder) {
    console.warn("ENGIDA: Running with temporary mock credentials. Real firestore connectivity requires UI step acceptance from the user.");
    return false;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("ENGIDA: Firebase Firestore connection verified successfully.");
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("ENGIDA Error: Please check your Firebase configuration or network status.", error);
    }
    return false;
  }
}

testConnection();

// Global handleFirestoreError conforming directly to required schema
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email || null,
      })) || []
    },
    operationType,
    path
  };
  
  console.error('[ENGIDA FIRESTORE SECURITY EXCEPTION]:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}
