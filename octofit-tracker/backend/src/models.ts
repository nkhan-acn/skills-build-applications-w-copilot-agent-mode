import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  age?: number;
  fitnessGoal?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeam extends Document {
  name: string;
  sport: string;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeaderboardEntry extends Document {
  user: mongoose.Types.ObjectId;
  points: number;
  streak: number;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkout extends Document {
  title: string;
  difficulty: string;
  durationMinutes: number;
  focusArea: string;
  equipment: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    age: { type: Number, min: 1 },
    fitnessGoal: { type: String, trim: true },
    location: { type: String, trim: true }
  },
  { timestamps: true }
);

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const activitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true, min: 0 },
    streak: { type: Number, default: 0, min: 0 },
    rank: { type: Number, default: 1, min: 1 }
  },
  { timestamps: true }
);

const workoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true, trim: true },
    difficulty: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    focusArea: { type: String, required: true, trim: true },
    equipment: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export const Team: Model<ITeam> = mongoose.model<ITeam>('Team', teamSchema);
export const Activity: Model<IActivity> = mongoose.model<IActivity>('Activity', activitySchema);
export const LeaderboardEntry: Model<ILeaderboardEntry> = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);
export const Workout: Model<IWorkout> = mongoose.model<IWorkout>('Workout', workoutSchema);
