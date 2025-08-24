import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { MediaType } from '../../common/enums';

@ObjectType()
export class MediaAsset {
  @Field(() => ID)
  id: string;

  @Field()
  listingId: string;

  @Field(() => MediaType)
  type: MediaType;

  @Field()
  url: string;

  @Field()
  sortOrder: number;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreateMediaAssetInput {
  @Field()
  @IsString()
  listingId: string;

  @Field(() => MediaType, { defaultValue: MediaType.PHOTO })
  @IsEnum(MediaType)
  @IsOptional()
  type?: MediaType;

  @Field()
  @IsString()
  url: string;

  @Field({ defaultValue: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}

@InputType()
export class UpdateMediaAssetInput {
  @Field(() => MediaType, { nullable: true })
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}

@InputType()
export class ReorderMediaInput {
  @Field(() => [ID])
  mediaIds: string[];
}
