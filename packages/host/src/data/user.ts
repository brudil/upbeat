import { sql } from 'slonik';
import { ID } from '../types';

export const getUserById = (id: ID) =>
  sql`FROM users SELECT * WHERE id = ${id}`;
