import type { ObjectId } from "mongodb";

export type UserDocument = {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
};
