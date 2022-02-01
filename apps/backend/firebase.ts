import admin from 'firebase-admin';
import serviceAccount from './serviceAccountSecretKey.json';

admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mochary-takehome-default-rtdb.firebaseio.com',
});

export default admin.firestore();
