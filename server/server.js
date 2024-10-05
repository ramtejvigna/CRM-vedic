import express from 'express';
import http from 'http';
import { connectToMongoDB } from './db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import EmployeeRouter from './routes/EmployeeRouter.js';
import dotenv from 'dotenv';

dotenv.config();
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from './routes/TaskRoutes.js'
import customerRoutes from './routes/customerRoutes.js'

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use('/api/employees',EmployeeRouter);
app.use('/api',taskRoutes)
app.use('/', authRoutes);
app.use('/customers', customerRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, connectToMongoDB() , ()=> console.log(`Server running on port ${PORT}`));