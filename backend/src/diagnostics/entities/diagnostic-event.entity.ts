import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export type SeverityLevel = 'INFO' | 'WARN' | 'ERROR';

@Entity('diagnostic_events')
export class DiagnosticEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  timestamp!: Date;

  @Index()
  @Column()
  vehicleId!: string;

  @Index()
  @Column()
  level!: SeverityLevel;

  @Index()
  @Column()
  code!: string;

  @Column()
  message!: string;

  @Column()
  rawLine!: string;
}
