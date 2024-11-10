import express from 'express';
import http from 'http';
import { connectToMongoDB } from './db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import employeeRoutes from './routes/EmployeeRouter.js';
import dotenv from 'dotenv';
import taskRoutes from './routes/TaskRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import salaryRoutes from "./routes/SalariesRoutes.js"
import nameRoutes from "./routes/nameRoutes.js"
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from "./routes/dashboardRoutes.js"
import {tokenExpirationMiddleware} from './middleware/auth.js';
import adminLeaveRoutes from './routes/adminLeaveRoutes.js'
import adminNotifications from "./routes/adminNotifications.js"
// import employeeRoutes from './routes/employeeRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';
// import errorMiddleware from './middleware/errorMiddleware.js';
import expensesRoutes from './routes/expensesRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
dotenv.config();
const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// middlewares
app.use(cors());
app.use(express.json({limit : '50mb'}));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


app.use(express.json());
app.use(bodyParser.json());


app.use('/api/employees',employeeRoutes);
app.use('/api',taskRoutes)
app.use('/api/', pdfRoutes);
app.use('/api/', authRoutes);
app.use('/',nameRoutes);
app.use('/', authRoutes);
app.use('/customers', customerRoutes);
app.use('/admin',adminLeaveRoutes)
app.use('/', dashboardRoutes);
app.use('/admin', adminNotifications)
app.use('/salaries' , salaryRoutes)
// app.use('/api/notifications', notificationRoutes);
app.use('/api/expenses', expensesRoutes);     // Expenses routes


const PORT = process.env.PORT || 8000;
server.listen(3000, connectToMongoDB(), () => console.log(`Server running on port ${PORT}`));