import express from 'express';
import http from 'http';
import { connectToMongoDB } from './db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import employeeRoutes from './routes/EmployeeRouter.js';
import dotenv from 'dotenv';
import taskRoutes from './routes/TaskRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import authRoutes from './routes/authRoutes.js';
// import employeeRoutes from './routes/employeeRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';
// import errorMiddleware from './middleware/errorMiddleware.js';
dotenv.config();
const app = express();
const server = http.createServer(app);

// middlewares
app.use(cors());
app.use(express.json({limit : '100mb'}));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(bodyParser.json());
app.use('/api/employees',employeeRoutes);
app.use('/api',taskRoutes)
app.use('/api/', pdfRoutes);
app.use('/api/', authRoutes);
app.use('/', authRoutes);
app.use('/customers', customerRoutes);
// app.use('/api/notifications', notificationRoutes);
// 
const PORT = process.env.PORT || 3000;
server.listen(PORT, connectToMongoDB(), () => console.log(`Server running on port ${PORT}`));
