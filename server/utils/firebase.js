import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your service account key JSON file
const serviceAccount = path.join(__dirname, './crm-vedic-firebase-adminsdk-d8q6m-ef40ee9310.json');

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'crm-vedic.appspot.com', // Your Firebase Storage Bucket URL
});

// Access Firebase Storage bucket
const bucket = admin.storage().bucket();

export { bucket };


export const uploadFileToFirebase = async (fileName, fileBuffer, type) => {
    const buffer = Buffer.from(fileBuffer, 'base64');

    const bucket = admin.storage().bucket();
    const file = bucket.file(`vedic/${fileName}`);

    try {
        await file.save(buffer, {
            metadata: { contentType: 'application/pdf' },
        });

        await file.makePublic();

        console.log('File uploaded to Firebase Storage');

        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        return fileUrl;
    } catch (error) {
        console.error('Error uploading file to Firebase:', error.message);
        throw error;
    }
};

export   const deleteFileFromFirebase = async (filePath) => {
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);
    
    try {
      await file.delete();
      console.log('File deleted from Firebase Storage');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };``
  