"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("../models");
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
async function seedDatabase() {
    console.log('Seed the octofit_db database with test data');
    await mongoose_1.default.connect(mongoUri);
    console.log('Connected to MongoDB for seeding');
    await Promise.all([
        models_1.User.deleteMany({}),
        models_1.Team.deleteMany({}),
        models_1.Activity.deleteMany({}),
        models_1.LeaderboardEntry.deleteMany({}),
        models_1.Workout.deleteMany({})
    ]);
    const users = await models_1.User.insertMany([
        {
            name: 'Ava Martinez',
            email: 'ava.martinez@example.com',
            age: 29,
            fitnessGoal: 'Marathon training',
            location: 'Seattle'
        },
        {
            name: 'Noah Chen',
            email: 'noah.chen@example.com',
            age: 34,
            fitnessGoal: 'Strength building',
            location: 'Austin'
        },
        {
            name: 'Mina Patel',
            email: 'mina.patel@example.com',
            age: 27,
            fitnessGoal: 'Improve mobility',
            location: 'Denver'
        }
    ]);
    const teams = await models_1.Team.insertMany([
        {
            name: 'Storm Squad',
            sport: 'Running',
            members: [users[0]._id, users[1]._id]
        },
        {
            name: 'River Runners',
            sport: 'Cycling',
            members: [users[2]._id]
        }
    ]);
    await models_1.Activity.insertMany([
        {
            user: users[0]._id,
            type: 'Run',
            durationMinutes: 32,
            caloriesBurned: 410,
            date: new Date('2026-06-25')
        },
        {
            user: users[1]._id,
            type: 'Strength',
            durationMinutes: 45,
            caloriesBurned: 320,
            date: new Date('2026-06-26')
        },
        {
            user: users[2]._id,
            type: 'Yoga',
            durationMinutes: 28,
            caloriesBurned: 180,
            date: new Date('2026-06-27')
        }
    ]);
    await models_1.LeaderboardEntry.insertMany([
        {
            user: users[0]._id,
            points: 1280,
            streak: 7,
            rank: 1
        },
        {
            user: users[1]._id,
            points: 1130,
            streak: 4,
            rank: 2
        },
        {
            user: users[2]._id,
            points: 980,
            streak: 3,
            rank: 3
        }
    ]);
    await models_1.Workout.insertMany([
        {
            title: 'Morning Mobility',
            difficulty: 'Easy',
            durationMinutes: 20,
            focusArea: 'Mobility',
            equipment: ['Yoga mat']
        },
        {
            title: 'Interval Sprint',
            difficulty: 'Hard',
            durationMinutes: 25,
            focusArea: 'Cardio',
            equipment: ['Running shoes']
        },
        {
            title: 'Upper Body Strength',
            difficulty: 'Medium',
            durationMinutes: 35,
            focusArea: 'Strength',
            equipment: ['Dumbbells', 'Bench']
        }
    ]);
    console.log(`Seeded ${users.length} users, ${teams.length} teams, activities, leaderboard entries, and workouts.`);
    await mongoose_1.default.disconnect();
}
seedDatabase().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
