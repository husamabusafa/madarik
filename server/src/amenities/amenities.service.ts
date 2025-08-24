import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAmenityInput, UpdateAmenityInput } from './dto/amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.amenity.findMany({
      orderBy: { labelEn: 'asc' },
    });
  }

  async findActive() {
    return this.prisma.amenity.findMany({
      where: { active: true },
      orderBy: { labelEn: 'asc' },
    });
  }

  async findById(id: string) {
    const amenity = await this.prisma.amenity.findUnique({
      where: { id },
    });

    if (!amenity) {
      throw new NotFoundException('Amenity not found');
    }

    return amenity;
  }

  async findByKey(key: string) {
    return this.prisma.amenity.findUnique({
      where: { key },
    });
  }

  async create(data: CreateAmenityInput) {
    const existingAmenity = await this.findByKey(data.key);
    if (existingAmenity) {
      throw new ConflictException('Amenity with this key already exists');
    }

    return this.prisma.amenity.create({
      data,
    });
  }

  async update(id: string, data: UpdateAmenityInput) {
    await this.findById(id);

    if (data.key) {
      const existingAmenity = await this.findByKey(data.key);
      if (existingAmenity && existingAmenity.id !== id) {
        throw new ConflictException('Amenity with this key already exists');
      }
    }

    return this.prisma.amenity.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    
    return this.prisma.amenity.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const amenity = await this.findById(id);
    
    return this.prisma.amenity.update({
      where: { id },
      data: { active: !amenity.active },
    });
  }
}
