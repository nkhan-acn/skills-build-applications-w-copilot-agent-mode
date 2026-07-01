"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
const users = [
    { id: 1, name: 'Ava', email: 'ava@example.com' },
    { id: 2, name: 'Noah', email: 'noah@example.com' },
];
const teams = [
    { id: 1, name: 'Storm Squad', members: ['Ava', 'Noah'] },
    { id: 2, name: 'River Runners', members: ['Mina'] },
];
const activities = [
    { id: 1, user: 'Ava', type: 'run', minutes: 30 },
    { id: 2, user: 'Noah', type: 'strength', minutes: 45 },
];
const leaderboard = [
    { id: 1, name: 'Ava', points: 1200 },
    { id: 2, name: 'Noah', points: 1100 },
];
const workouts = [
    { id: 1, title: 'Morning Mobility', difficulty: 'easy', duration: 20 },
    { id: 2, title: 'Interval Sprint', difficulty: 'hard', duration: 25 },
];
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.get('/api/config', (_req, res) => {
    res.json({ baseUrl, port, environment: process.env.NODE_ENV || 'development' });
});
app.get('/api/users/', (_req, res) => {
    res.json(users);
});
app.post('/api/users/', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }
    const user = { id: users.length + 1, name, email };
    users.push(user);
    return res.status(201).json(user);
});
app.get('/api/teams/', (_req, res) => {
    res.json(teams);
});
app.post('/api/teams/', (req, res) => {
    const { name, members } = req.body;
    if (!name || !Array.isArray(members)) {
        return res.status(400).json({ error: 'Name and members array are required.' });
    }
    const team = { id: teams.length + 1, name, members };
    teams.push(team);
    return res.status(201).json(team);
});
app.get('/api/activities/', (_req, res) => {
    res.json(activities);
});
app.post('/api/activities/', (req, res) => {
    const { user, type, minutes } = req.body;
    if (!user || !type || typeof minutes !== 'number') {
        return res.status(400).json({ error: 'User, type, and minutes are required.' });
    }
    const activity = { id: activities.length + 1, user, type, minutes };
    activities.push(activity);
    return res.status(201).json(activity);
});
app.get('/api/leaderboard/', (_req, res) => {
    res.json(leaderboard);
});
app.post('/api/leaderboard/', (req, res) => {
    const { name, points } = req.body;
    if (!name || typeof points !== 'number') {
        return res.status(400).json({ error: 'Name and points are required.' });
    }
    const entry = { id: leaderboard.length + 1, name, points };
    leaderboard.push(entry);
    return res.status(201).json(entry);
});
app.get('/api/workouts/', (_req, res) => {
    res.json(workouts);
});
app.post('/api/workouts/', (req, res) => {
    const { title, difficulty, duration } = req.body;
    if (!title || !difficulty || typeof duration !== 'number') {
        return res.status(400).json({ error: 'Title, difficulty, and duration are required.' });
    }
    const workout = { id: workouts.length + 1, title, difficulty, duration };
    workouts.push(workout);
    return res.status(201).json(workout);
});
mongoose_1.default
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
