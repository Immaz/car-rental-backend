import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsNumberString,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  transmission: string;

  @IsNotEmpty()
  @IsString()
  fuel: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  capacity: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  added_by: number;
}

export class UpdateVehicleDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  transmission: string;

  @IsNotEmpty()
  @IsString()
  fuel: string; // was fuel_type

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  capacity: number; // was seating_capacity

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class SearchDto {
  @IsString()
  query: string;

  @Type(() => Number)
  @IsNumber()
  maxPrice: string;

  @Type(() => Number)
  @IsNumber()
  minPrice: string;

  @IsString()
  pickupDate: string;

  @IsString()
  returnDate: string;

  @IsString()
  vehicleType: string;

  @IsString()
  location: string;
}
