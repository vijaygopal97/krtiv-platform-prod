import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import signpostRoutes from './routes/signpost.js';
import meRoutes from './routes/me.js';
import heroSlidesRoutes from './routes/heroSlides.js';
import adminHeroRoutes from './routes/adminHero.js';
import adminPlannerRoutes from './routes/adminPlanner.js';
import adminDashboardRoutes from './routes/adminDashboard.js';
import myItinerariesRoutes from './routes/myItineraries.js';
import plannerRoutes from './routes/planner.js';

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kraik';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Access-Token', 'X-Auth-Token'],
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/hero-slides', heroSlidesRoutes);
app.use('/api/admin', adminHeroRoutes);
app.use('/api/admin', adminPlannerRoutes);
app.use('/api/admin', adminDashboardRoutes);
app.use('/api/signpost', signpostRoutes);
app.use('/api/me', meRoutes);
app.use('/api/my/itineraries', myItinerariesRoutes);
app.use('/api/planner', plannerRoutes);
// When reverse proxy forwards full path (e.g. /kraik/api/...), mount again
app.use('/kraik/api/auth', authRoutes);
app.use('/kraik/api/hero-slides', heroSlidesRoutes);
app.use('/kraik/api/admin', adminHeroRoutes);
app.use('/kraik/api/admin', adminPlannerRoutes);
app.use('/kraik/api/admin', adminDashboardRoutes);
app.use('/kraik/api/signpost', signpostRoutes);
app.use('/kraik/api/me', meRoutes);
app.use('/kraik/api/my/itineraries', myItinerariesRoutes);
app.use('/kraik/api/planner', plannerRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'kraik-api' });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Kraik API running on port ${PORT}`);
  });
}

start().catch(console.error);
