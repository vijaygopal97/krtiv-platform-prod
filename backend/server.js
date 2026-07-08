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
import contentRoutes from './routes/content.js';
import adminContentRoutes from './routes/adminContent.js';
import myItinerariesRoutes from './routes/myItineraries.js';
import myPlacesRoutes from './routes/myPlaces.js';
import plannerRoutes from './routes/planner.js';
import journeysRoutes from './routes/journeys.js';
import adminJourneysRoutes from './routes/adminJourneys.js';
import featuredExperiencesRoutes from './routes/featuredExperiences.js';
import experienceBlogsRoutes from './routes/experienceBlogs.js';
import adminFeaturedExperiencesRoutes from './routes/adminFeaturedExperiences.js';
import visitorLocationRoutes from './routes/visitorLocation.js';

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
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminContentRoutes);
app.use('/api/signpost', signpostRoutes);
app.use('/api/me', meRoutes);
app.use('/api/my/itineraries', myItinerariesRoutes);
app.use('/api/my/places', myPlacesRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/journeys', journeysRoutes);
app.use('/api/admin', adminJourneysRoutes);
app.use('/api/featured-experiences', featuredExperiencesRoutes);
app.use('/api/experience-blogs', experienceBlogsRoutes);
app.use('/api/admin', adminFeaturedExperiencesRoutes);
app.use('/api/visitor-location', visitorLocationRoutes);
// When reverse proxy forwards full path (e.g. /kraik/api/...), mount again
app.use('/kraik/api/auth', authRoutes);
app.use('/kraik/api/hero-slides', heroSlidesRoutes);
app.use('/kraik/api/admin', adminHeroRoutes);
app.use('/kraik/api/admin', adminPlannerRoutes);
app.use('/kraik/api/admin', adminDashboardRoutes);
app.use('/kraik/api/content', contentRoutes);
app.use('/kraik/api/admin', adminContentRoutes);
app.use('/kraik/api/signpost', signpostRoutes);
app.use('/kraik/api/me', meRoutes);
app.use('/kraik/api/my/itineraries', myItinerariesRoutes);
app.use('/kraik/api/my/places', myPlacesRoutes);
app.use('/kraik/api/planner', plannerRoutes);
app.use('/kraik/api/journeys', journeysRoutes);
app.use('/kraik/api/admin', adminJourneysRoutes);
app.use('/kraik/api/featured-experiences', featuredExperiencesRoutes);
app.use('/kraik/api/experience-blogs', experienceBlogsRoutes);
app.use('/kraik/api/admin', adminFeaturedExperiencesRoutes);
app.use('/kraik/api/visitor-location', visitorLocationRoutes);

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
