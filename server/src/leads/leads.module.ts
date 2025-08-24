import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsResolver } from './leads.resolver';
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [ListingsModule],
  providers: [LeadsService, LeadsResolver],
  exports: [LeadsService],
})
export class LeadsModule {}
