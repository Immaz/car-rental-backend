import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column()
  transmission: string;

  @Column()
  fuel: string;

  @Column()
  capacity: number;

  @Column()
  location: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  added_by: number;
}
