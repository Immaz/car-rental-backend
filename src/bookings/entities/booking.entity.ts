import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  booked_by: number;

  @Column()
  vehicleId: number;

  @Column()
  from: Date;

  @Column()
  to: Date;

  @Column({ default: false })
  isCanceled: boolean;

  @Column({ default: 0 })
  total: number;
}
