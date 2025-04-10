import { Schema, model, Document } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { config } from '../config';

const generateId = customAlphabet(config.nanoid.alphabet, config.nanoid.length);

// Define the interface for the User document
export interface IUser extends Document {
  _id: string; // Custom id field
  username: string;
  password: string;
  email: string;
  givenName: string;
  familyName: string;
  roles: Array<'admin' | 'user' | 'moderator'>;
  langs: Array<'fanés'>;
  lastSessionAt: Date;
}

// Define the schema
const UserSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
      default: () => generateId(),
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    givenName: { type: String, required: true },
    familyName: { type: String, required: true },
    langs: { type: [String], enum: config.supportedLangs, required: true },
    roles: { type: [String], enum: config.roleList, required: true },
    lastSessionAt: { type: Date },
  },
  {
    collection: 'users',
    timestamps: true,
    versionKey: false,
    id: false,
    writeConcern: { w: 'majority', j: true, wtimeout: 5000 },
    toObject: { versionKey: false },
  }
);

// Hide internal fields in JSON
UserSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform: (_doc: Document, ret: Record<string, any>) => {
    delete ret.__v;
    return ret;
  },
});

export const UserModel = model<IUser>('User', UserSchema);