import { forwardRef, Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclePicture } from './entities/vehicle.picture.entity';
import { ImageKitProvider } from 'src/imagekit.provider';
import { ConfigModule } from '@nestjs/config';
import { Reviews } from './entities/reviews.entity';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, VehiclePicture, Reviews]),
    ConfigModule,
    forwardRef(() => BookingsModule),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService, ImageKitProvider],
  exports: [VehiclesService],
})
export class VehiclesModule {}
