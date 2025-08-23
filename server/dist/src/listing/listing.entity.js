"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = void 0;
const graphql_1 = require("@nestjs/graphql");
const client_1 = require("@prisma/client");
(0, graphql_1.registerEnumType)(client_1.ListingStatus, {
    name: 'ListingStatus',
    description: 'Listing status',
});
(0, graphql_1.registerEnumType)(client_1.ListingType, {
    name: 'ListingType',
    description: 'Listing type (Sale/Rent)',
});
(0, graphql_1.registerEnumType)(client_1.PropertyType, {
    name: 'PropertyType',
    description: 'Property type',
});
(0, graphql_1.registerEnumType)(client_1.AreaUnit, {
    name: 'AreaUnit',
    description: 'Area unit (SQM/SQFT)',
});
let Listing = class Listing {
    id;
    companyId;
    status;
    propertyType;
    listingType;
    price;
    currency;
    areaValue;
    areaUnit;
    bedrooms;
    bathrooms;
    parking;
    yearBuilt;
    addressLine;
    city;
    areaCode;
    country;
    lat;
    lng;
    zoomHint;
    primaryPhotoUrl;
    publishedAt;
    createdAt;
    updatedAt;
};
exports.Listing = Listing;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Listing.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Listing.prototype, "companyId", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.ListingStatus),
    __metadata("design:type", String)
], Listing.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.PropertyType),
    __metadata("design:type", String)
], Listing.prototype, "propertyType", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.ListingType),
    __metadata("design:type", String)
], Listing.prototype, "listingType", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Listing.prototype, "currency", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "areaValue", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.AreaUnit, { nullable: true }),
    __metadata("design:type", String)
], Listing.prototype, "areaUnit", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "bedrooms", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "bathrooms", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "parking", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "yearBuilt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Listing.prototype, "addressLine", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Listing.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Listing.prototype, "areaCode", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Listing.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Listing.prototype, "lat", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Listing.prototype, "lng", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "zoomHint", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Listing.prototype, "primaryPhotoUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Listing.prototype, "publishedAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Listing.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Listing.prototype, "updatedAt", void 0);
exports.Listing = Listing = __decorate([
    (0, graphql_1.ObjectType)()
], Listing);
//# sourceMappingURL=listing.entity.js.map