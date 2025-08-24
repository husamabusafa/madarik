import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

@ObjectType()
export class Amenity {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field()
  labelEn: string;

  @Field()
  labelAr: string;

  @Field()
  active: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateAmenityInput {
  @Field()
  @IsString()
  key: string;

  @Field()
  @IsString()
  labelEn: string;

  @Field()
  @IsString()
  labelAr: string;

  @Field({ defaultValue: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

@InputType()
export class UpdateAmenityInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  key?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  labelEn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  labelAr?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
