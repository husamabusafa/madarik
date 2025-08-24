import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { LeadsModule } from './leads/leads.module';
import { InvitesModule } from './invites/invites.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { MediaModule } from './media/media.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    LeadsModule,
    InvitesModule,
    AmenitiesModule,
    MediaModule,
    SettingsModule,
  ],
})
export class AppModule {}
