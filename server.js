import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import { Routes } from './routes.js';
import { DBconnection } from './utils/dbconnect.js';
dotenv.config();

// Initilialisation
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Server, Database & REST endpoints
const PORT = process.env.PORT
app.listen(PORT, async() => {
        console.info(`The server is running on http://localhost:${PORT}`);
        Routes(app);
        await DBconnection();
})