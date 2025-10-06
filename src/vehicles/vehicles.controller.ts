import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Request,
  HttpException,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import {
  CreateVehicleDto,
  SearchDto,
  UpdateVehicleDto,
} from './dto/vehicle.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReviewsDto } from './dto/reviews.dto';
import { JwtverifyGuard } from 'src/guards/jwtverify.guard';
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseInterceptors(FilesInterceptor('pictures'))
  @Post()
  @UseGuards(JwtverifyGuard)
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createVehicleDto: CreateVehicleDto,
    @Request() req: any,
  ) {
    if (req.role === 'admin' || req.role === 'owner') {
      const vehicle = await this.vehiclesService.create(
        createVehicleDto,
        files,
      );
      return { message: 'Vehicle Added', data: vehicle };
    } else {
      throw new HttpException('Not Authorized ', 401);
    }
  }

  @Get()
  async findAll() {
    const vehicles = await this.vehiclesService.findAll();
    return { message: 'Vehicles', data: vehicles };
  }

  @Post('search')
  async search(@Body() searchdto: SearchDto) {
    const vehicles = await this.vehiclesService.search(searchdto);
    return { message: 'Searched Vehicles', data: vehicles };
  }

  @UseGuards(JwtverifyGuard)
  @Post('review/:vid')
  async reviews(@Body() reviewdto: ReviewsDto) {
    const review = await this.vehiclesService.review(reviewdto);
    return { message: 'Review Given', data: review };
  }

  @Get('reviews/:vid')
  async getReviews(@Param('vid') vehicle_id: number) {
    const reviews = await this.vehiclesService.getReviews(vehicle_id);
    return { message: 'Reviews', data: reviews };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findOne(id as any);
    return {
      message: 'Vehicle Found',
      data: { ...vehicle },
    };
  }

  @UseGuards(JwtverifyGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('pictures'))
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @UploadedFiles() pictures: Express.Multer.File[],
    @Request() req: any,
  ) {
    if (req.role === 'admin' || req.role === 'owner') {
      const updatedVehicle = await this.vehiclesService.update(
        +id,
        updateVehicleDto,
        pictures,
        req,
      );
      return { message: 'Vehicle Updated', data: updatedVehicle };
    } else {
      throw new HttpException('Not Authorized ', 401);
    }
  }

  @UseGuards(JwtverifyGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(+id);
  }
}
