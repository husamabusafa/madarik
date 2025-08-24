import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { Amenity, CreateAmenityInput, UpdateAmenityInput } from './dto/amenity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Amenity)
export class AmenitiesResolver {
  constructor(private amenitiesService: AmenitiesService) {}

  @Query(() => [Amenity])
  async amenities(): Promise<Amenity[]> {
    return this.amenitiesService.findAll();
  }

  @Query(() => [Amenity])
  async activeAmenities(): Promise<Amenity[]> {
    return this.amenitiesService.findActive();
  }

  @Query(() => Amenity)
  async amenity(@Args('id', { type: () => ID }) id: string): Promise<Amenity> {
    return this.amenitiesService.findById(id);
  }

  @Mutation(() => Amenity)
  @UseGuards(JwtAuthGuard)
  async createAmenity(@Args('input') input: CreateAmenityInput): Promise<Amenity> {
    return this.amenitiesService.create(input);
  }

  @Mutation(() => Amenity)
  @UseGuards(JwtAuthGuard)
  async updateAmenity(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAmenityInput,
  ): Promise<Amenity> {
    return this.amenitiesService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteAmenity(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.amenitiesService.delete(id);
    return true;
  }

  @Mutation(() => Amenity)
  @UseGuards(JwtAuthGuard)
  async toggleAmenityActive(@Args('id', { type: () => ID }) id: string): Promise<Amenity> {
    return this.amenitiesService.toggleActive(id);
  }
}
