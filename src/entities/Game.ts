import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Player } from './Player';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Player, { eager: true, nullable: false })
  @JoinColumn({ name: 'playerXId' })
  playerX!: Player;

  @ManyToOne(() => Player, { eager: true, nullable: false })
  @JoinColumn({ name: 'playerOId' })
  playerO!: Player;

  @ManyToOne(() => Player, { eager: true, nullable: true })
  @JoinColumn({ name: 'winnerId' })
  winner!: Player | null;

  @Column({ type: 'text' })
  moves!: string;

  @Column({ default: 'in_progress' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt!: Date | null;
}
