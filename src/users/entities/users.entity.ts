import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone_no: string;

  @Column({ type: 'date', nullable: true })
  dob: string;

  @Column()
  address: string;

  @Column()
  role: string;

  @Column({ default: false })
  active: boolean;
}
