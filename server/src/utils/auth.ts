import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";

export async function authenticate(username: string, password: string) {
  const users = getCustomRepository(UserRepository);

  const user = await users.getByUsername(username);

  if (!user) {
    return null;
  }

  const isValid = await user.authenticatePassword(password);

  if (isValid) {
    return user;
  }

  return null;
}

export async function validateJWT(decoded: any) {
  const users = getCustomRepository(UserRepository);

  const user = await users.findOneById(decoded.userId);
  return { isValid: true, credentials: { user } };
}
