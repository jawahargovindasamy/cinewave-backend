import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import connectDB from './src/config/database.js';
import './src/config/passport.js';
import authRoutes from './src/routes/authRoutes.js';
import passwordRoutes from './src/routes/passwordRoutes.js';
import continueWatchingRoutes from './src/routes/continueWatchingRoutes.js';
import watchlistRoutes from './src/routes/watchlistRoutes.js';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes

app.get('/', (req, res) => {
  res.send('CineWave Backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);

app.use('/api/continue-watching', continueWatchingRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});