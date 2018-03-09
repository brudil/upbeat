import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { compare } from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column() firstName: string;

  @Column() lastName: string;

  @Column({
    type: 'text',
  })
  username: string;

  @Column({
    type: 'text',
  })
  password: string;


  authenticatePassword(password: string) {
    return compare(password, this.password)
  }
}
