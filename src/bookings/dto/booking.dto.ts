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
export class CreateBookingDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  booked_by: number;

  @IsDateString()
  @IsNotEmpty()
  from: string;

  @IsDateString()
  @IsNotEmpty()
  to: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsString()
  @IsNotEmpty()
  paymentIntentId;
}

export class UpdateBookingDto {}

export class CancelBookingDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  bookingId: number;
}
