import { ObjectType, Field, ID, InputType, Float } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';
import { ListingStatus, ListingType, PropertyType, AreaUnit } from '../../common/enums';
import { User } from '../../users/dto/user.dto';

@ObjectType()
export class Listing {
  @Field(() => ID)
  id: string;

  @Field(() => ListingStatus)
  status: ListingStatus;

  @Field(() => PropertyType)
  propertyType: PropertyType;

  @Field(() => ListingType)
  listingType: ListingType;

  @Field({ nullable: true })
  price?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field(() => String, { nullable: true })
  areaValue?: string;

  @Field(() => AreaUnit, { nullable: true })
  areaUnit?: AreaUnit;

  @Field({ nullable: true })
  bedrooms?: number;

  @Field({ nullable: true })
  bathrooms?: number;

  @Field({ nullable: true })
  parking?: number;

  @Field({ nullable: true })
  yearBuilt?: number;

  @Field()
  addressLine: string;

  @Field()
  city: string;

  @Field({ nullable: true })
  areaCode?: string;

  @Field()
  country: string;

  @Field(() => String)
  lat: string;

  @Field(() => String)
  lng: string;

  @Field({ nullable: true })
  zoomHint?: number;

  @Field({ nullable: true })
  primaryPhotoUrl?: string;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  createdByUserId?: string;

  @Field({ nullable: true })
  lastEditedByUserId?: string;

  @Field(() => User, { nullable: true })
  createdBy?: User;

  @Field(() => User, { nullable: true })
  lastEditedBy?: User;

  @Field(() => [ListingTranslation])
  translations: ListingTranslation[];
}

@InputType()
export class SearchListingsFiltersInput {
  @Field(() => PropertyType, { nullable: true })
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @Field(() => ListingType, { nullable: true })
  @IsOptional()
  @IsEnum(ListingType)
  listingType?: ListingType;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;
}

@ObjectType()
export class ListingTranslation {
  @Field(() => ID)
  id: string;

  @Field()
  listingId: string;

  @Field()
  locale: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  displayAddressLine?: string;

  @Field({ nullable: true })
  areaName?: string;

  @Field()
  slug: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateListingInput {
  @Field(() => PropertyType)
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @Field(() => ListingType)
  @IsEnum(ListingType)
  listingType: ListingType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  price?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  areaValue?: string;

  @Field(() => AreaUnit, { nullable: true })
  @IsOptional()
  @IsEnum(AreaUnit)
  areaUnit?: AreaUnit;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  parking?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  yearBuilt?: number;

  @Field()
  @IsString()
  addressLine: string;

  @Field()
  @IsString()
  city: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  areaCode?: string;

  @Field()
  @IsString()
  country: string;

  @Field(() => String)
  @IsString()
  lat: string;

  @Field(() => String)
  @IsString()
  lng: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  zoomHint?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  primaryPhotoUrl?: string;

  @Field(() => [CreateListingTranslationInput])
  translations: CreateListingTranslationInput[];
}

@InputType()
export class CreateListingTranslationInput {
  @Field(() => String)
  @IsString()
  locale: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  displayAddressLine?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  areaName?: string;

  @Field()
  @IsString()
  slug: string;
}

@InputType()
export class UpdateListingInput {
  @Field(() => ListingStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @Field(() => PropertyType, { nullable: true })
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @Field(() => ListingType, { nullable: true })
  @IsOptional()
  @IsEnum(ListingType)
  listingType?: ListingType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  price?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  areaValue?: string;

  @Field(() => AreaUnit, { nullable: true })
  @IsOptional()
  @IsEnum(AreaUnit)
  areaUnit?: AreaUnit;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  parking?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  yearBuilt?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  addressLine?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  areaCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lat?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lng?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  zoomHint?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  primaryPhotoUrl?: string;
}
