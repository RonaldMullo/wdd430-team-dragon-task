import { hash } from "bcryptjs";
import { getDatabase } from "@/lib/mongodb";
import type { PublicUser, UserDocument } from "@/types/user";

export async function getUsersCollection() {
  const db = await getDatabase();

  const collection = db.collection<UserDocument>("users");

  await collection.createIndex({ email: 1 }, { unique: true });

  return collection;
}

export async function findUserByEmail(email: string) {
  const collection = await getUsersCollection();

  return collection.findOne({
    email: email.trim().toLowerCase(),
  });
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<PublicUser> {
  const collection = await getUsersCollection();

  const normalizedEmail = email.trim().toLowerCase();

  const passwordHash = await hash(password, 12);

  const newUser: UserDocument = {
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(newUser);

  return {
    id: result.insertedId.toString(),
    name: newUser.name,
    email: newUser.email,
  };
}
