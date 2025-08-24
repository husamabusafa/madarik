import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaAsset, CreateMediaAssetInput, UpdateMediaAssetInput, ReorderMediaInput } from './dto/media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => MediaAsset)
export class MediaResolver {
  constructor(private mediaService: MediaService) {}

  @Query(() => [MediaAsset])
  @UseGuards(JwtAuthGuard)
  async mediaAssets(): Promise<MediaAsset[]> {
    return this.mediaService.findAll();
  }

  @Query(() => [MediaAsset])
  async mediaByListing(@Args('listingId', { type: () => ID }) listingId: string): Promise<MediaAsset[]> {
    return this.mediaService.findByListingId(listingId);
  }

  @Query(() => MediaAsset)
  @UseGuards(JwtAuthGuard)
  async mediaAsset(@Args('id', { type: () => ID }) id: string): Promise<MediaAsset> {
    return this.mediaService.findById(id);
  }

  @Mutation(() => MediaAsset)
  @UseGuards(JwtAuthGuard)
  async createMediaAsset(@Args('input') input: CreateMediaAssetInput): Promise<MediaAsset> {
    return this.mediaService.create(input);
  }

  @Mutation(() => MediaAsset)
  @UseGuards(JwtAuthGuard)
  async updateMediaAsset(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateMediaAssetInput,
  ): Promise<MediaAsset> {
    return this.mediaService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteMediaAsset(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.mediaService.delete(id);
    return true;
  }

  @Mutation(() => [MediaAsset])
  @UseGuards(JwtAuthGuard)
  async reorderMedia(
    @Args('listingId', { type: () => ID }) listingId: string,
    @Args('input') input: ReorderMediaInput,
  ): Promise<MediaAsset[]> {
    return this.mediaService.reorderMedia(listingId, input);
  }
}
