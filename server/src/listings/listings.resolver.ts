import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Listing, CreateListingInput, UpdateListingInput, SearchListingsFiltersInput } from './dto/listing.dto';
import { User } from '../users/dto/user.dto';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListingStatus } from '../common/enums';

@Resolver(() => Listing)
export class ListingsResolver {
  constructor(private listingsService: ListingsService) {}

  @Query(() => [Listing])
  @UseGuards(JwtAuthGuard)
  async listings(): Promise<Listing[]> {
    return this.listingsService.findAll();
  }

  @Query(() => Listing)
  @UseGuards(JwtAuthGuard)
  async listing(@Args('id', { type: () => ID }) id: string): Promise<Listing> {
    return this.listingsService.findById(id);
  }

  @Query(() => [Listing])
  async publishedListings(): Promise<Listing[]> {
    return this.listingsService.getPublishedListings();
  }

  @Query(() => [Listing])
  async searchListings(
    @Args('query', { nullable: true }) query?: string,
    @Args('filters', { type: () => SearchListingsFiltersInput, nullable: true }) filters?: SearchListingsFiltersInput,
  ): Promise<Listing[]> {
    return this.listingsService.searchListings(query, filters);
  }

  @Mutation(() => Listing)
  @UseGuards(JwtAuthGuard)
  async createListing(
    @Args('input') input: CreateListingInput,
    @CurrentUser() user: User,
  ): Promise<Listing> {
    return this.listingsService.create(input, user.id);
  }

  @Mutation(() => Listing)
  @UseGuards(JwtAuthGuard)
  async updateListing(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateListingInput,
    @CurrentUser() user: User,
  ): Promise<Listing> {
    return this.listingsService.update(id, input, user.id);
  }

  @Mutation(() => Listing)
  @UseGuards(JwtAuthGuard)
  async updateListingStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => ListingStatus }) status: ListingStatus,
    @Args('reason', { nullable: true }) reason?: string,
    @CurrentUser() user?: User,
  ): Promise<Listing> {
    return this.listingsService.updateStatus(id, status, user.id, reason);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteListing(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.listingsService.delete(id);
    return true;
  }

  @Mutation(() => Boolean)
  async incrementListingViews(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.listingsService.incrementViewCount(id);
    return true;
  }
}
