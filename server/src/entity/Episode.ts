import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Episode {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: 'text',
  })
  title: string;
}
