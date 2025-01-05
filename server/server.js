import express from 'express';
import http from 'http';
import { connectToMongoDB } from './db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import AdminAuthRoutes from "./routes/AdminAuthRoutes.js"
import employeeRoutes from './routes/EmployeeRouter.js';
import dotenv from 'dotenv';
import taskRoutes from './routes/TaskRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import salaryRoutes from "./routes/SalariesRoutes.js"
import nameRoutes from "./routes/nameRoutes.js"
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from "./routes/dashboardRoutes.js"
import adminLeaveRoutes from './routes/adminLeaveRoutes.js'
import adminNotifications from "./routes/adminNotifications.js"
import managerRoutes from "./routes/ManagerRoutes.js"
import expensesRoutes from './routes/expensesRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import astroRoutes from './routes/astroRoutes.js';
import ReportsRouter from "./routes/ReportsRouter.js"
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import { dirname } from 'path';


import "./deadlineNotification.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

app.use(cors({
    origin: [
      "https://crm-vedic-manager.netlify.app", 
      "http://localhost:5173", 
      "http://localhost:5174",
      "http://localhost:5175",
      "https://vedic-crm.netlify.app", 
      "https://vedic-employee.netlify.app", 
      "https://vedic-form.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }));
  
app.use(express.json({limit : '50mb'}));
app.use(express.urlencoded({ limit: '100mb', extended: true }))


app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser())

app.use(astroRoutes);
app.use('/api/employees',employeeRoutes);
app.use('/api',taskRoutes)
app.use('/api/', pdfRoutes);
app.use('/api/', authRoutes);
app.use('/',nameRoutes);
app.use('/', authRoutes);
app.use('/customers', customerRoutes);
app.use('/admin',adminLeaveRoutes)
app.use('/', dashboardRoutes);
app.use('/api/manager' , managerRoutes);
app.use('/admin', adminNotifications)
app.use('/salaries' , salaryRoutes)
app.use('/api/expenses', expensesRoutes);   
app.use('/admin/auth' , AdminAuthRoutes)
app.use('/api/reports',ReportsRouter)
app.use('/categories', categoryRoutes)




const PORT = process.env.PORT || 9000;
server.listen(PORT, connectToMongoDB(), () => console.log(`Server running on port ${PORT}`));

