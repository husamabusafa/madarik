import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsUrl } from 'class-validator';

@ObjectType()
export class SiteSetting {
  @Field(() => ID)
  id: string;

  @Field()
  siteNameEn: string;

  @Field()
  siteNameAr: string;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field({ nullable: true })
  publicEmail?: string;

  @Field({ nullable: true })
  publicPhone?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  city?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateSiteSettingInput {
  @Field()
  @IsString()
  siteNameEn: string;

  @Field()
  @IsString()
  siteNameAr: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  publicEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  publicPhone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  website?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;
}

@InputType()
export class UpdateSiteSettingInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  siteNameEn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  siteNameAr?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  publicEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  publicPhone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  website?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;
}
