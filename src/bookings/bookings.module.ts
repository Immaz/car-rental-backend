import { forwardRef, Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesModule } from 'src/vehicles/vehicles.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { EmailService } from 'src/services/email.service';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    forwardRef(() => VehiclesModule),
    PaymentsModule,
    UsersModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, EmailService],
  exports: [BookingsService],
})
export class BookingsModule {}
