import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesResolver } from './invites.resolver';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [UsersModule, AuthModule, MailModule],
  providers: [InvitesService, InvitesResolver],
  exports: [InvitesService],
})
export class InvitesModule {}
