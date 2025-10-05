// IMPORTANT: This file is for SERVER-SIDE code and should only be imported in other server-side files.
// It uses the Firebase Admin SDK, which requires sensitive credentials.

import * as admin from 'firebase-admin';

// Memoization variable to ensure Firebase is initialized only once.
let app: admin.app.App | null = null;

/**
 * Initializes and returns a server-side Firebase Admin app instance.
 * It ensures that initialization happens only once (singleton pattern).
 *
 * This function retrieves credentials from environment variables, which should be
 * stored in a `.env.local` file for local development.
 *
 * @returns An object containing the initialized Firebase Admin app, Auth, and Firestore services.
 * @throws {Error} If Firebase Admin credentials are not found in environment variables.
 */
export function initializeServerFirebase() {
  if (app) {
    return {
      app,
      auth: admin.auth(app),
      firestore: admin.firestore(app),
    };
  }

  // Retrieve credentials from environment variables.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error(
      'Firebase Admin credentials not found. Make sure FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID are set in your .env.local file.'
    );
  }

  const credentials = {
    privateKey,
    clientEmail,
    projectId,
  };

  app = admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });

  return {
    app,
    auth: admin.auth(app),
    firestore: admin.firestore(app),
  };
}
