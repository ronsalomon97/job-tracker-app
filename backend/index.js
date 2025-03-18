import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

//Allow Local & Vercel Frontend
const allowedOrigins = [
  "http://localhost:5173",  // Local frontend
  "https://job-tracker-app-sigma.vercel.app",  // Vercel frontend
  "https://job-tracker-nni0jerup-ron-salomons-projects.vercel.app"  // Vercel frontend (if needed)
];

app.use(cors({
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allows cookies, auth headers
}));

// Import your routes
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';

// Mount the routes with proper prefixes
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5001;
console.log("Attempting to start server...");
console.log("PORT:", PORT);
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
