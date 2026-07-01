import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

type User = { id: number; name: string; email: string };
type Team = { id: number; name: string; members: string[] };
type Activity = { id: number; user: string; type: string; minutes: number };
type LeaderboardEntry = { id: number; name: string; points: number };
type Workout = { id: number; title: string; difficulty: string; duration: number };

const users: User[] = [
  { id: 1, name: 'Ava', email: 'ava@example.com' },
  { id: 2, name: 'Noah', email: 'noah@example.com' },
];

const teams: Team[] = [
  { id: 1, name: 'Storm Squad', members: ['Ava', 'Noah'] },
  { id: 2, name: 'River Runners', members: ['Mina'] },
];

const activities: Activity[] = [
  { id: 1, user: 'Ava', type: 'run', minutes: 30 },
  { id: 2, user: 'Noah', type: 'strength', minutes: 45 },
];

const leaderboard: LeaderboardEntry[] = [
  { id: 1, name: 'Ava', points: 1200 },
  { id: 2, name: 'Noah', points: 1100 },
];

const workouts: Workout[] = [
  { id: 1, title: 'Morning Mobility', difficulty: 'easy', duration: 20 },
  { id: 2, title: 'Interval Sprint', difficulty: 'hard', duration: 25 },
];

app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/config', (_req: Request, res: Response) => {
  res.json({ baseUrl, port, environment: process.env.NODE_ENV || 'development' });
});

app.get('/api/users/', (_req: Request, res: Response) => {
  res.json(users);
});

app.post('/api/users/', (req: Request, res: Response) => {
  const { name, email } = req.body as Partial<User>;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const user: User = { id: users.length + 1, name, email };
  users.push(user);
  return res.status(201).json(user);
});

app.get('/api/teams/', (_req: Request, res: Response) => {
  res.json(teams);
});

app.post('/api/teams/', (req: Request, res: Response) => {
  const { name, members } = req.body as Partial<Team>;
  if (!name || !Array.isArray(members)) {
    return res.status(400).json({ error: 'Name and members array are required.' });
  }

  const team: Team = { id: teams.length + 1, name, members };
  teams.push(team);
  return res.status(201).json(team);
});

app.get('/api/activities/', (_req: Request, res: Response) => {
  res.json(activities);
});

app.post('/api/activities/', (req: Request, res: Response) => {
  const { user, type, minutes } = req.body as Partial<Activity>;
  if (!user || !type || typeof minutes !== 'number') {
    return res.status(400).json({ error: 'User, type, and minutes are required.' });
  }

  const activity: Activity = { id: activities.length + 1, user, type, minutes };
  activities.push(activity);
  return res.status(201).json(activity);
});

app.get('/api/leaderboard/', (_req: Request, res: Response) => {
  res.json(leaderboard);
});

app.post('/api/leaderboard/', (req: Request, res: Response) => {
  const { name, points } = req.body as Partial<LeaderboardEntry>;
  if (!name || typeof points !== 'number') {
    return res.status(400).json({ error: 'Name and points are required.' });
  }

  const entry: LeaderboardEntry = { id: leaderboard.length + 1, name, points };
  leaderboard.push(entry);
  return res.status(201).json(entry);
});

app.get('/api/workouts/', (_req: Request, res: Response) => {
  res.json(workouts);
});

app.post('/api/workouts/', (req: Request, res: Response) => {
  const { title, difficulty, duration } = req.body as Partial<Workout>;
  if (!title || !difficulty || typeof duration !== 'number') {
    return res.status(400).json({ error: 'Title, difficulty, and duration are required.' });
  }

  const workout: Workout = { id: workouts.length + 1, title, difficulty, duration };
  workouts.push(workout);
  return res.status(201).json(workout);
});

mongoose
  .connect(mongoUri)
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
