import { registerEnumType } from '@nestjs/graphql';
import { 
  Locale as PrismaLocale,
  UserRole as PrismaUserRole,
  InviteStatus as PrismaInviteStatus,
  ListingStatus as PrismaListingStatus,
  ListingType as PrismaListingType,
  PropertyType as PrismaPropertyType,
  AreaUnit as PrismaAreaUnit,
  MediaType as PrismaMediaType,
} from '@prisma/client';

// Re-export Prisma enums
export const Locale = PrismaLocale;
export const UserRole = PrismaUserRole;
export const InviteStatus = PrismaInviteStatus;
export const ListingStatus = PrismaListingStatus;
export const ListingType = PrismaListingType;
export const PropertyType = PrismaPropertyType;
export const AreaUnit = PrismaAreaUnit;
export const MediaType = PrismaMediaType;

export type Locale = PrismaLocale;
export type UserRole = PrismaUserRole;
export type InviteStatus = PrismaInviteStatus;
export type ListingStatus = PrismaListingStatus;
export type ListingType = PrismaListingType;
export type PropertyType = PrismaPropertyType;
export type AreaUnit = PrismaAreaUnit;
export type MediaType = PrismaMediaType;

// Register enums with GraphQL
registerEnumType(Locale, { name: 'Locale' });
registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(InviteStatus, { name: 'InviteStatus' });
registerEnumType(ListingStatus, { name: 'ListingStatus' });
registerEnumType(ListingType, { name: 'ListingType' });
registerEnumType(PropertyType, { name: 'PropertyType' });
registerEnumType(AreaUnit, { name: 'AreaUnit' });
registerEnumType(MediaType, { name: 'MediaType' });
