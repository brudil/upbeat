import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Programme {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    default: '',
    type: 'text',
  })
  title: string;
}
