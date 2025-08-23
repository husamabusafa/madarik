import { ObjectType, Field, ID, registerEnumType, Float, Int } from '@nestjs/graphql';
import { ListingStatus, ListingType, PropertyType, AreaUnit } from '@prisma/client';

// Register enums for GraphQL
registerEnumType(ListingStatus, {
  name: 'ListingStatus',
  description: 'Listing status',
});

registerEnumType(ListingType, {
  name: 'ListingType',
  description: 'Listing type (Sale/Rent)',
});

registerEnumType(PropertyType, {
  name: 'PropertyType',
  description: 'Property type',
});

registerEnumType(AreaUnit, {
  name: 'AreaUnit',
  description: 'Area unit (SQM/SQFT)',
});

@ObjectType()
export class Listing {
  @Field(() => ID)
  id: string;

  @Field()
  companyId: string;

  @Field(() => ListingStatus)
  status: ListingStatus;

  @Field(() => PropertyType)
  propertyType: PropertyType;

  @Field(() => ListingType)
  listingType: ListingType;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  currency?: string;

  @Field(() => Float, { nullable: true })
  areaValue?: number;

  @Field(() => AreaUnit, { nullable: true })
  areaUnit?: AreaUnit;

  @Field(() => Int, { nullable: true })
  bedrooms?: number;

  @Field(() => Int, { nullable: true })
  bathrooms?: number;

  @Field(() => Int, { nullable: true })
  parking?: number;

  @Field(() => Int, { nullable: true })
  yearBuilt?: number;

  @Field()
  addressLine: string;

  @Field()
  city: string;

  @Field({ nullable: true })
  areaCode?: string;

  @Field()
  country: string;

  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;

  @Field(() => Int, { nullable: true })
  zoomHint?: number;

  @Field({ nullable: true })
  primaryPhotoUrl?: string;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

