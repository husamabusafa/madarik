import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SiteSetting, CreateSiteSettingInput, UpdateSiteSettingInput } from './dto/settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => SiteSetting)
export class SettingsResolver {
  constructor(private settingsService: SettingsService) {}

  @Query(() => SiteSetting)
  async siteSettings(): Promise<SiteSetting> {
    return this.settingsService.getSiteSettings();
  }

  @Mutation(() => SiteSetting)
  @UseGuards(JwtAuthGuard)
  async createSiteSettings(@Args('input') input: CreateSiteSettingInput): Promise<SiteSetting> {
    return this.settingsService.createSiteSettings(input);
  }

  @Mutation(() => SiteSetting)
  @UseGuards(JwtAuthGuard)
  async updateSiteSettings(@Args('input') input: UpdateSiteSettingInput): Promise<SiteSetting> {
    return this.settingsService.updateSiteSettings(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteSiteSettings(): Promise<boolean> {
    await this.settingsService.deleteSiteSettings();
    return true;
  }
}
