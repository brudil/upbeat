import argon2 from 'argon2';
import { DatabasePoolType, sql } from 'slonik';
import { ID } from '../types';

interface UserRow {
  id: ID;
  emailAddress: string;
  passwordHash: string;
}

export const authenticate = async (
  perhapsPassword: string,
  currentHash: string,
): Promise<boolean> => {
  try {
    return await argon2.verify(currentHash, perhapsPassword);
  } catch (e) {
    return false;
  }
};

export const getUserById = (pool: DatabasePoolType, id: ID) =>
  pool.one<UserRow>(sql`SELECT * FROM users WHERE id = ${id}`);

export const authenticateUser = async (
  pool: DatabasePoolType,
  payload: { emailAddress: string; password: string },
): Promise<[boolean, UserRow | undefined]> => {
  const res = await pool.one<UserRow>(
    sql`SELECT * FROM users WHERE email_address = ${payload.emailAddress}`,
  );

  if (await authenticate(payload.password, res.passwordHash)) {
    // lol
    return [true, res];
  }

  return [false, undefined];
};
