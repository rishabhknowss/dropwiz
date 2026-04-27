import bcrypt from "bcryptjs";

export { passwordSchema } from "./schemas";

const SALT_ROUNDS = 12;

const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeOeFDCyF0.Q6JY5.8yZl.PIcRxWHpoxSq";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function dummyCompare(): Promise<void> {
  await bcrypt.compare("timing-safe-dummy-compare", DUMMY_HASH);
}
