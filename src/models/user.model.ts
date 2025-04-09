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
}

// 2. Define the schema
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

// 3. Hide internal fields in JSON
UserSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform: (_doc: Document, ret: Record<string, any>) => {
    delete ret.__v;
    return ret;
  },
});

export const UserModel = model<IUser>('User', UserSchema);

// const UserSchema = new Schema(
//   {
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     givenName: { type: String, required: true },
//     familyName: { type: String, required: true },
//   },
//   {
//     collection: 'users',
//     timestamps: true,
//     // User info is important -- specify write concern of 'majority'.
//     writeConcern: { w: 'majority', j: true, wtimeout: 5000 },
//     versionKey: false,
//     id: false, // No additional id as virtual getter.
//     toJSON: { versionKey: false, virtuals: true },
//     toObject: { versionKey: false },
//   }
// )

// if (!UserSchema.options.toJSON) {
//   UserSchema.options.toJSON = {}
// }

// UserSchema.options.toJSON.transform = function (doc, ret) {
//   delete ret.__v
// }

// module.exports = mongoose.model('users', UserSchema)