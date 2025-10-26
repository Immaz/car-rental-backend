import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import {
  CancelBookingDto,
  CreateBookingDto,
  UpdateBookingDto,
} from './dto/booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { VehiclesService } from '../vehicles/vehicles.service';
import { PaymentsService } from 'src/payments/payments.service';
import { EmailService } from 'src/services/email.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @Inject(forwardRef(() => VehiclesService))
    private readonly vehicleService: VehiclesService,
    private readonly paymentService: PaymentsService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}
  async create(createBookingDto: CreateBookingDto) {
    try {
      const isPaid = await this.paymentService.verifyPayment(
        createBookingDto.paymentIntentId,
      );

      if (!isPaid) {
        throw new HttpException('Payment not completed', 400);
      }

      const bookingData = this.bookingRepo.create(createBookingDto as any);
      const booking = await this.bookingRepo.save(bookingData);

      const user = await this.usersService.getUser(createBookingDto.booked_by);
      await this.emailService.sendEmail(
        'Booking Confirmed',
        `Hey ${user?.first_name + ' ' + user?.last_name}. Your Booking is confirmed`,
        `${user?.email}`,
      );
      return { data: booking, message: 'Booking confirmed' };
    } catch (e) {
      throw new HttpException(e, 200);
    }
  }

  async findAll(role: string, userId: number) {
    try {
      let bookings;

      if (role === 'admin') {
        bookings = await this.bookingRepo.find();
      } else if (role === 'owner') {
        bookings = await this.bookingRepo
          .createQueryBuilder('b')
          .where(
            'b."vehicleId" IN (SELECT v.id FROM vehicles v WHERE v.added_by = :addedBy)',
            { addedBy: userId },
          )
          .getMany();
      } else {
        bookings = await this.bookingRepo.find({
          where: { booked_by: userId },
        });
      }

      // fetch vehicle info for each booking
      const bookingsWithVehicles = await Promise.all(
        bookings.map(async (booking) => {
          const vehicle = await this.vehicleService.findOne(
            booking.vehicleId as any,
          );
          return { ...booking, vehicle };
        }),
      );
      return {
        data: { ...bookingsWithVehicles },
        message: 'All bookings fetched successfully',
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 200);
    }
  }

  async findOne(id: number) {
    try {
      const booking = await this.bookingRepo.findOne({ where: { id } });

      if (!booking) {
        throw new HttpException(`Booking with id ${id} not found`, 404);
      }

      return {
        data: { ...booking },
        message: `Booking #${id} fetched successfully`,
      };
    } catch (e) {
      throw new HttpException(e, 200);
    }
  }

  async cancel(id: number) {
    try {
      const booking = await this.bookingRepo.findOne({ where: { id } });

      if (!booking) {
        throw new HttpException('Booking not found', 404);
      }

      if (booking.isCanceled) {
        throw new HttpException('Booking is already canceled', 400);
      }

      booking.isCanceled = true;
      await this.bookingRepo.save(booking);

      return {
        message: `Booking #${id} canceled successfully`,
        data: booking,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to cancel booking',
        error.status || 500,
      );
    }
  }

  async getBookingByVehicleID(vid: number) {
    const booking = await this.bookingRepo.find({
      where: { vehicleId: vid },
    });
    return { data: booking };
  }
  async deleteBookingByVehicleID(vid: number) {
    try {
      await this.bookingRepo.delete({
        vehicleId: vid,
      });
      return true;
    } catch (e) {
      throw new HttpException('error deleting vehicle', 200);
    }
  }
}
