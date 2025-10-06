import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity({ name: 'vehicle_pictures' })
export class VehiclePicture {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  url: string;
  @Column()
  vehicle_id: number;
  @Column()
  fileId: string;
}
