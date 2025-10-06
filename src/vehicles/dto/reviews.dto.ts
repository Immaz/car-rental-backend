import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
export class ReviewsDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNumber()
  rating: number;

  @IsString()
  text: string;

  @Type(() => Number)
  @IsNumber()
  vehicle_id: number;
}
