import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { Lead, LeadStats, CreateLeadInput, UpdateLeadInput } from './dto/lead.dto';
import { User } from '../users/dto/user.dto';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(private leadsService: LeadsService) {}

  @Query(() => [Lead])
  @UseGuards(JwtAuthGuard)
  async leads(): Promise<Lead[]> {
    return this.leadsService.findAll();
  }

  @Query(() => Lead)
  @UseGuards(JwtAuthGuard)
  async lead(@Args('id', { type: () => ID }) id: string): Promise<Lead> {
    return this.leadsService.findById(id);
  }

  @Query(() => [Lead])
  @UseGuards(JwtAuthGuard)
  async leadsByListing(@Args('listingId', { type: () => ID }) listingId: string): Promise<Lead[]> {
    return this.leadsService.findByListingId(listingId);
  }

  @Query(() => [Lead])
  @UseGuards(JwtAuthGuard)
  async myLeads(@CurrentUser() user: User): Promise<Lead[]> {
    return this.leadsService.findByAssignedUser(user.id);
  }

  @Query(() => LeadStats)
  @UseGuards(JwtAuthGuard)
  async leadStats(): Promise<LeadStats> {
    return this.leadsService.getLeadStats();
  }

  @Query(() => [Lead])
  @UseGuards(JwtAuthGuard)
  async searchLeads(@Args('query') query: string): Promise<Lead[]> {
    return this.leadsService.searchLeads(query);
  }

  @Mutation(() => Lead)
  async createLead(@Args('input') input: CreateLeadInput): Promise<Lead> {
    return this.leadsService.create(input);
  }

  @Mutation(() => Lead)
  @UseGuards(JwtAuthGuard)
  async updateLead(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateLeadInput,
  ): Promise<Lead> {
    return this.leadsService.update(id, input);
  }

  @Mutation(() => Lead)
  @UseGuards(JwtAuthGuard)
  async assignLead(
    @Args('id', { type: () => ID }) id: string,
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<Lead> {
    return this.leadsService.assignLead(id, userId);
  }

  @Mutation(() => Lead)
  @UseGuards(JwtAuthGuard)
  async unassignLead(@Args('id', { type: () => ID }) id: string): Promise<Lead> {
    return this.leadsService.unassignLead(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteLead(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.leadsService.delete(id);
    return true;
  }
}
