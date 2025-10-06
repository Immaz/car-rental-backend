import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CancelBookingDto, CreateBookingDto } from './dto/booking.dto';
import { JwtverifyGuard } from 'src/guards/jwtverify.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtverifyGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingsService.create(createBookingDto);
  }

  @Get('vehicle/:id')
  async getbooking(@Param('id') vehicleId: number) {
    return await this.bookingsService.getBookingByVehicleID(vehicleId);
  }

  @UseGuards(JwtverifyGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.bookingsService.findAll(
      req.role as string,
      req.userId as number,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @UseGuards(JwtverifyGuard)
  @Patch('cancel')
  cancel(@Body() cancelbookingDto: CancelBookingDto) {
    return this.bookingsService.cancel(cancelbookingDto.bookingId);
  }
}
