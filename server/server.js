import express from 'express';
import http from 'http';
import { connectToMongoDB } from './db.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());


connectToMongoDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));