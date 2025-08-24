import { Module } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesResolver } from './amenities.resolver';

@Module({
  providers: [AmenitiesService, AmenitiesResolver],
  exports: [AmenitiesService],
})
export class AmenitiesModule {}
