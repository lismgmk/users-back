import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlackList {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  tokenValue: string;
}
