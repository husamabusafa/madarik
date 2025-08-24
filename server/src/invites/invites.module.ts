import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesResolver } from './invites.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [InvitesService, InvitesResolver],
  exports: [InvitesService],
})
export class InvitesModule {}
