import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';
import { User } from '../../users/dto/user.dto';
import { Listing } from '../../listings/dto/listing.dto';

@ObjectType()
export class Lead {
  @Field(() => ID)
  id: string;

  @Field()
  listingId: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  message?: string;

  @Field()
  consent: boolean;

  @Field({ nullable: true })
  source?: string;

  @Field({ nullable: true })
  ipAddress?: string;

  @Field({ nullable: true })
  userAgent?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  assignedToUserId?: string;

  @Field(() => User, { nullable: true })
  assignedTo?: User;

  @Field(() => Listing)
  listing: Listing;
}

@ObjectType()
export class LeadStats {
  @Field()
  totalLeads: number;

  @Field()
  newLeads: number;

  @Field()
  assignedLeads: number;

  @Field()
  unassignedLeads: number;

  @Field()
  thisWeekLeads: number;

  @Field()
  conversionRate: number;
}

@InputType()
export class CreateLeadInput {
  @Field()
  @IsString()
  listingId: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  message?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  consent: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  source?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

@InputType()
export class UpdateLeadInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  message?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assignedToUserId?: string;
}
