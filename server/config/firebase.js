import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Usually, you download the serviceAccountKey.json from Firebase Console.
// For now, we will mock initialize it so the server doesn't crash without credentials.
try {
  let serviceAccount;
  if (process.env.FIREBASE_CREDENTIALS) {
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin Initialized Successfully');
  } else {
    console.warn('Firebase Credentials not provided. Firebase verification will be skipped or mocked.');
  }
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error);
}

export default admin;
