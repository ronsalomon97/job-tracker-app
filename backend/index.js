import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));


// Import your routes
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';

// Mount the routes with proper prefixes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5001;
console.log("Attempting to start server...");
console.log("PORT:", PORT);
app.listen(PORT, '0.0.0.0' , () => console.log(`Server running on port ${PORT}`));
