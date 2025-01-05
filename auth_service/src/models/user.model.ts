import mongoose, { ObjectId, Types } from 'mongoose';

export interface IUser extends mongoose.Document<Types.ObjectId> {
  username: String;
  fullName: String;
  password: String;
  email: String;
  followers: Array<Types.ObjectId>;
  following: Array<Types.ObjectId>;
  profileImg: String;
  coverImg: String;
  bio: String;
  link: String;
}
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minLength: 6
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
      }
    ],
    profileImg: {
      type: String,
      default: ''
    },
    coverImg: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
