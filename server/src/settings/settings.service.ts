import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSiteSettingInput, UpdateSiteSettingInput } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSiteSettings() {
    // Get the first (and should be only) site setting record
    const settings = await this.prisma.siteSetting.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      return this.prisma.siteSetting.create({
        data: {
          siteNameEn: 'Real Estate Platform',
          siteNameAr: 'منصة العقارات',
          country: 'UAE',
          city: 'Dubai',
        },
      });
    }

    return settings;
  }

  async createSiteSettings(data: CreateSiteSettingInput) {
    // Check if settings already exist
    const existingSettings = await this.prisma.siteSetting.findFirst();
    if (existingSettings) {
      throw new Error('Site settings already exist. Use update instead.');
    }

    return this.prisma.siteSetting.create({
      data,
    });
  }

  async updateSiteSettings(data: UpdateSiteSettingInput) {
    const settings = await this.getSiteSettings();

    return this.prisma.siteSetting.update({
      where: { id: settings.id },
      data,
    });
  }

  async deleteSiteSettings() {
    const settings = await this.getSiteSettings();
    
    return this.prisma.siteSetting.delete({
      where: { id: settings.id },
    });
  }
}
