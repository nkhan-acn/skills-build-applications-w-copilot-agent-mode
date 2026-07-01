"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models");
const database_1 = require("./database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.get('/api/config', (_req, res) => {
    res.json({ baseUrl, port, environment: process.env.NODE_ENV || 'development' });
});
app.get('/api/users/', async (_req, res) => {
    const users = await models_1.User.find().lean();
    res.json(users);
});
app.post('/api/users/', async (req, res) => {
    const { name, email, age, fitnessGoal, location } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }
    const user = await models_1.User.create({ name, email, age, fitnessGoal, location });
    return res.status(201).json(user);
});
app.get('/api/teams/', async (_req, res) => {
    const teams = await models_1.Team.find().populate('members').lean();
    res.json(teams);
});
app.post('/api/teams/', async (req, res) => {
    const { name, sport, members } = req.body;
    if (!name || !sport || !Array.isArray(members)) {
        return res.status(400).json({ error: 'Name, sport, and members array are required.' });
    }
    const team = await models_1.Team.create({ name, sport, members });
    return res.status(201).json(team);
});
app.get('/api/activities/', async (_req, res) => {
    const activities = await models_1.Activity.find().populate('user').lean();
    res.json(activities);
});
app.post('/api/activities/', async (req, res) => {
    const { user, type, durationMinutes, caloriesBurned, date } = req.body;
    if (!user || !type || typeof durationMinutes !== 'number' || typeof caloriesBurned !== 'number') {
        return res.status(400).json({ error: 'User, type, durationMinutes, and caloriesBurned are required.' });
    }
    const activity = await models_1.Activity.create({
        user,
        type,
        durationMinutes,
        caloriesBurned,
        date: date ? new Date(date) : undefined
    });
    return res.status(201).json(activity);
});
app.get('/api/leaderboard/', async (_req, res) => {
    const leaderboard = await models_1.LeaderboardEntry.find().populate('user').lean();
    res.json(leaderboard);
});
app.post('/api/leaderboard/', async (req, res) => {
    const { user, points, streak, rank } = req.body;
    if (!user || typeof points !== 'number') {
        return res.status(400).json({ error: 'User and points are required.' });
    }
    const entry = await models_1.LeaderboardEntry.create({ user, points, streak, rank });
    return res.status(201).json(entry);
});
app.get('/api/workouts/', async (_req, res) => {
    const workouts = await models_1.Workout.find().lean();
    res.json(workouts);
});
app.post('/api/workouts/', async (req, res) => {
    const { title, difficulty, durationMinutes, focusArea, equipment } = req.body;
    if (!title || !difficulty || typeof durationMinutes !== 'number' || !focusArea) {
        return res.status(400).json({ error: 'Title, difficulty, durationMinutes, and focusArea are required.' });
    }
    const workout = await models_1.Workout.create({ title, difficulty, durationMinutes, focusArea, equipment });
    return res.status(201).json(workout);
});
(0, database_1.connectToDatabase)()
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
