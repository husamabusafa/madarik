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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyMember = exports.Company = void 0;
const graphql_1 = require("@nestjs/graphql");
const client_1 = require("@prisma/client");
(0, graphql_1.registerEnumType)(client_1.MemberRole, {
    name: 'MemberRole',
    description: 'Company member roles',
});
let Company = class Company {
    id;
    ownerUserId;
    name;
    slug;
    logoUrl;
    country;
    city;
    publicEmail;
    publicPhone;
    website;
    isActive;
    createdAt;
    updatedAt;
};
exports.Company = Company;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Company.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Company.prototype, "ownerUserId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Company.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "logoUrl", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Company.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Company.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "publicEmail", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "publicPhone", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "website", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Company.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Company.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Company.prototype, "updatedAt", void 0);
exports.Company = Company = __decorate([
    (0, graphql_1.ObjectType)()
], Company);
let CompanyMember = class CompanyMember {
    companyId;
    userId;
    role;
    addedAt;
};
exports.CompanyMember = CompanyMember;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CompanyMember.prototype, "companyId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CompanyMember.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.MemberRole),
    __metadata("design:type", typeof (_a = typeof client_1.MemberRole !== "undefined" && client_1.MemberRole) === "function" ? _a : Object)
], CompanyMember.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CompanyMember.prototype, "addedAt", void 0);
exports.CompanyMember = CompanyMember = __decorate([
    (0, graphql_1.ObjectType)()
], CompanyMember);
//# sourceMappingURL=company.entity.js.map