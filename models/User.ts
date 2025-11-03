import mongoose, { Schema, models, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  role: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '/default-avatar.jpg',
  },
  bio: {
    type: String,
    default: '',
  },
    role: {
    type: String,
    default: 'user',
  },
}, {
  timestamps: true,
});

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;