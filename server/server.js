import express from 'express';
import http from 'http';
import { connectToMongoDB } from './db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import serviceAccount from './base64-ca5d9-firebase-adminsdk-n09fb-08a8fa9e65.json' assert { type: 'json' };


import EmployeeRouter from './routes/EmployeeRouter.js';
import dotenv from 'dotenv';
import taskRoutes from './routes/TaskRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://base64-ca5d9.appspot.com",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api', pdfRoutes); 
app.use('/api', taskRoutes);
app.use('/api/', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/', authRoutes);
app.use('/customers', customerRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, connectToMongoDB() , () => console.log(`Server running on port ${PORT}`));
