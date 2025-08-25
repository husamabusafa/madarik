import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class SendTestEmailInput {
  @Field()
  @IsEmail()
  to!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  html?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  text?: string;
}

@ObjectType()
export class SendTestEmailResult {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  messageId?: string;

  @Field({ nullable: true })
  skipped?: boolean;

  @Field({ nullable: true })
  error?: string;

  @Field({ nullable: true })
  raw?: string;
}
