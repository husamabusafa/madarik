import { ListingStatus, ListingType, PropertyType, AreaUnit } from '@prisma/client';
export declare class Listing {
    id: string;
    companyId: string;
    status: ListingStatus;
    propertyType: PropertyType;
    listingType: ListingType;
    price?: number;
    currency?: string;
    areaValue?: number;
    areaUnit?: AreaUnit;
    bedrooms?: number;
    bathrooms?: number;
    parking?: number;
    yearBuilt?: number;
    addressLine: string;
    city: string;
    areaCode?: string;
    country: string;
    lat: number;
    lng: number;
    zoomHint?: number;
    primaryPhotoUrl?: string;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
