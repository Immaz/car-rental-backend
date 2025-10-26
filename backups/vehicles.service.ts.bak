import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateVehicleDto,
  SearchDto,
  UpdateVehicleDto,
} from './dto/vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclePicture } from './entities/vehicle.picture.entity';
import { Repository } from 'typeorm';
import { Reviews } from './entities/reviews.entity';
import { ReviewsDto } from './dto/reviews.dto';
import { BookingsService } from 'src/bookings/bookings.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,

    @InjectRepository(Reviews)
    private reviewRepo: Repository<Reviews>,

    @InjectRepository(VehiclePicture)
    private pictureRepo: Repository<VehiclePicture>,

    @Inject('IMAGEKIT') private readonly imagekit,

    @Inject(forwardRef(() => BookingsService))
    private readonly bookingsService: BookingsService,
  ) {}
  async create(createVehicleDto: CreateVehicleDto, files) {
    try {
      const vehicleData: any = this.vehicleRepo.create(createVehicleDto);
      const vehicle = await this.vehicleRepo.save(vehicleData);

      const uploadedPictures = await Promise.all(
        files.map(async (file) => {
          const res = await this.imagekit.upload({
            file: file.buffer, // raw file
            fileName: `${Date.now()}-${file.originalname}`,
            folder: '/vehicles', // optional ImageKit folder
          });

          // 3. Save picture record in DB
          return this.pictureRepo.save(
            this.pictureRepo.create({
              url: res.url,
              vehicle_id: vehicle.id,
              fileId: res.fileId,
            }),
          );
        }),
      );

      return {
        ...vehicle,
        pictures: uploadedPictures,
      };
    } catch (e) {
      throw new HttpException(e, 200);
    }
  }

  async findAll() {
    try {
      const vehicles = await this.vehicleRepo.find();
      const pictures = await this.pictureRepo.find();

      return vehicles.map((vehicle) => ({
        ...vehicle,
        pictures: pictures.filter((p) => p.vehicle_id === vehicle.id),
      }));
    } catch (e) {
      throw new HttpException(e, 200);
    }
  }

  async findOne(id: number) {
    try {
      const vehicle = await this.vehicleRepo.findOne({ where: { id } });

      const pictures = await this.pictureRepo.find({
        where: { vehicle_id: id },
      });

      return { ...vehicle, pictures };
    } catch (e) {
      throw new HttpException(e, 200);
    }
  }
  async update(
    id: number,
    updateDto: UpdateVehicleDto,
    pictures: Express.Multer.File[],
    req: any,
  ) {
    try {
      //Update vehicle details
      await this.vehicleRepo.update(id, updateDto);

      let vehicle = await this.vehicleRepo.findOne({ where: { id } });
      if (pictures && pictures.length > 0) {
        // Delete old pictures
        const oldPictures = await this.pictureRepo.find({
          where: { vehicle_id: id },
        });

        for (const pic of oldPictures) {
          try {
            await this.imagekit.deleteFile(pic.fileId);
          } catch (err) {
            throw new HttpException('Cant delete old pictures', 200);
          }
          await this.pictureRepo.remove(pic);
        }
        // uploading new pics
        for (const file of pictures) {
          const uploaded = await this.imagekit.upload({
            file: file.buffer.toString('base64'), // file buffer
            fileName: file.originalname,
            folder: '/vehicles',
          });

          const newPic = this.pictureRepo.create({
            url: uploaded.url,
            fileId: uploaded.fileId,
            vehicle_id: vehicle?.id,
          });

          await this.pictureRepo.save(newPic);
        }
      }
      return { message: 'vehicle updated' };
    } catch (e) {
      throw new HttpException(e.message, 200);
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.vehicleRepo.delete(id);

      if (deleted.affected == 0) {
        throw new HttpException('Vehicle not found', 200);
      }
      const pictures = await this.pictureRepo.find({
        where: { vehicle_id: id },
      });

      for (const pic of pictures) {
        await this.imagekit.deleteFile(pic.fileId);
      }

      await this.pictureRepo.delete({ vehicle_id: id });

      // delete bookings
      await this.bookingsService.deleteBookingByVehicleID(id);

      return { message: 'vehicle deleted' };
    } catch (e) {
      throw new HttpException(e, 200);
    }
  }

  async search(searchdto: SearchDto) {
    const query = `
 SELECT v.*
 FROM public.vehicles v
 WHERE (v.brand || ' ' || v.model || ' ' || v.year::text) ILIKE '%${searchdto.query}%'
   AND v.price BETWEEN ${searchdto.minPrice || 0} AND ${searchdto.maxPrice || 10000}
   ${searchdto.location ? `AND v.location ILIKE '%${searchdto.location}%'` : ''}
   ${searchdto.vehicleType ? `AND v.category = '${searchdto.vehicleType}'` : ''}
   ${
     searchdto.pickupDate && searchdto.returnDate
       ? `AND NOT EXISTS (
            SELECT 1
            FROM bookings b
            WHERE b."vehicleId" = v.id
              AND b."isCanceled" = false
              AND b."from" <= '${searchdto.returnDate}'
              AND b."to"   >= '${searchdto.pickupDate}'
          )`
       : ''
   }
`;
    try {
      const vehicles = await this.vehicleRepo.query(query);
      const pictures = await this.pictureRepo.find();

      return vehicles.map((vehicle) => ({
        ...vehicle,
        pictures: pictures.filter((p) => p.vehicle_id === vehicle.id),
      }));
    } catch (e) {
      throw new HttpException(e, 200);
    }
  }

  async review(reviewsdto: ReviewsDto) {
    const reviewsData = this.reviewRepo.create(reviewsdto);
    return await this.reviewRepo.save(reviewsData);
  }
  async getReviews(vehicle_id: number) {
    return await this.reviewRepo.find({
      where: { vehicle_id: vehicle_id },
      order: { id: 'DESC' },
    });
  }
}
