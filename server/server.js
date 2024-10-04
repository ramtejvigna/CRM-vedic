import express from 'express';
import http from 'http';
import { connectToMongoDB } from './db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import taskRoutes from './routes/TaskRoutes.js'
const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use('/api',taskRoutes)


const PORT = process.env.PORT || 3000;
server.listen(PORT, connectToMongoDB() , ()=> console.log(`Server running on port ${PORT}`));