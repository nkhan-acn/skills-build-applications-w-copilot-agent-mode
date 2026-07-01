import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';
import { connectToDatabase } from './database';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/config', (_req: Request, res: Response) => {
  res.json({ baseUrl, port, environment: process.env.NODE_ENV || 'development' });
});

app.get('/api/users/', async (_req: Request, res: Response) => {
  const users = await User.find().lean();
  res.json(users);
});

app.post('/api/users/', async (req: Request, res: Response) => {
  const { name, email, age, fitnessGoal, location } = req.body as Partial<{
    name: string;
    email: string;
    age: number;
    fitnessGoal: string;
    location: string;
  }>;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const user = await User.create({ name, email, age, fitnessGoal, location });
  return res.status(201).json(user);
});

app.get('/api/teams/', async (_req: Request, res: Response) => {
  const teams = await Team.find().populate('members').lean();
  res.json(teams);
});

app.post('/api/teams/', async (req: Request, res: Response) => {
  const { name, sport, members } = req.body as Partial<{ name: string; sport: string; members: string[] }>;
  if (!name || !sport || !Array.isArray(members)) {
    return res.status(400).json({ error: 'Name, sport, and members array are required.' });
  }

  const team = await Team.create({ name, sport, members });
  return res.status(201).json(team);
});

app.get('/api/activities/', async (_req: Request, res: Response) => {
  const activities = await Activity.find().populate('user').lean();
  res.json(activities);
});

app.post('/api/activities/', async (req: Request, res: Response) => {
  const { user, type, durationMinutes, caloriesBurned, date } = req.body as Partial<{
    user: string;
    type: string;
    durationMinutes: number;
    caloriesBurned: number;
    date: string;
  }>;
  if (!user || !type || typeof durationMinutes !== 'number' || typeof caloriesBurned !== 'number') {
    return res.status(400).json({ error: 'User, type, durationMinutes, and caloriesBurned are required.' });
  }

  const activity = await Activity.create({
    user,
    type,
    durationMinutes,
    caloriesBurned,
    date: date ? new Date(date) : undefined
  });
  return res.status(201).json(activity);
});

app.get('/api/leaderboard/', async (_req: Request, res: Response) => {
  const leaderboard = await LeaderboardEntry.find().populate('user').lean();
  res.json(leaderboard);
});

app.post('/api/leaderboard/', async (req: Request, res: Response) => {
  const { user, points, streak, rank } = req.body as Partial<{
    user: string;
    points: number;
    streak: number;
    rank: number;
  }>;
  if (!user || typeof points !== 'number') {
    return res.status(400).json({ error: 'User and points are required.' });
  }

  const entry = await LeaderboardEntry.create({ user, points, streak, rank });
  return res.status(201).json(entry);
});

app.get('/api/workouts/', async (_req: Request, res: Response) => {
  const workouts = await Workout.find().lean();
  res.json(workouts);
});

app.post('/api/workouts/', async (req: Request, res: Response) => {
  const { title, difficulty, durationMinutes, focusArea, equipment } = req.body as Partial<{
    title: string;
    difficulty: string;
    durationMinutes: number;
    focusArea: string;
    equipment: string[];
  }>;
  if (!title || !difficulty || typeof durationMinutes !== 'number' || !focusArea) {
    return res.status(400).json({ error: 'Title, difficulty, durationMinutes, and focusArea are required.' });
  }

  const workout = await Workout.create({ title, difficulty, durationMinutes, focusArea, equipment });
  return res.status(201).json(workout);
});

connectToDatabase()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
      console.log(`API base URL: ${baseUrl}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
