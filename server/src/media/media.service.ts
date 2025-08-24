import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMediaAssetInput, UpdateMediaAssetInput, ReorderMediaInput } from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.mediaAsset.findMany({
      orderBy: [{ listingId: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async findByListingId(listingId: string) {
    return this.prisma.mediaAsset.findMany({
      where: { listingId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findById(id: string) {
    const media = await this.prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Media asset not found');
    }

    return media;
  }

  async create(data: CreateMediaAssetInput) {
    // Get the next sort order for this listing
    const lastMedia = await this.prisma.mediaAsset.findFirst({
      where: { listingId: data.listingId },
      orderBy: { sortOrder: 'desc' },
    });

    const sortOrder = data.sortOrder ?? (lastMedia ? lastMedia.sortOrder + 1 : 0);

    return this.prisma.mediaAsset.create({
      data: {
        ...data,
        sortOrder,
      },
    });
  }

  async update(id: string, data: UpdateMediaAssetInput) {
    await this.findById(id);

    return this.prisma.mediaAsset.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    
    return this.prisma.mediaAsset.delete({
      where: { id },
    });
  }

  async reorderMedia(listingId: string, data: ReorderMediaInput) {
    const mediaAssets = await this.prisma.mediaAsset.findMany({
      where: { 
        listingId,
        id: { in: data.mediaIds },
      },
    });

    if (mediaAssets.length !== data.mediaIds.length) {
      throw new NotFoundException('Some media assets not found');
    }

    // Update sort orders based on the new order
    const updatePromises = data.mediaIds.map((mediaId, index) =>
      this.prisma.mediaAsset.update({
        where: { id: mediaId },
        data: { sortOrder: index },
      })
    );

    await Promise.all(updatePromises);

    return this.findByListingId(listingId);
  }

  async deleteByListingId(listingId: string) {
    return this.prisma.mediaAsset.deleteMany({
      where: { listingId },
    });
  }
}
