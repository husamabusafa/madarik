import { PrismaClient, UserRole, Locale } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create initial admin user
    const adminEmail = 'admin@madarik.com';
    const adminPassword = 'Admin123!'; // Change this in production

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash: hashedPassword,
          role: UserRole.ADMIN,
          preferredLocale: Locale.EN,
          emailVerifiedAt: new Date(),
          isActive: true,
        },
      });

      console.log('✅ Admin user created:', {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      });
      console.log('🔑 Admin credentials:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('⚠️  Please change the admin password after first login!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create initial site settings
    const existingSiteSettings = await prisma.siteSetting.findFirst();
    
    if (!existingSiteSettings) {
      const siteSettings = await prisma.siteSetting.create({
        data: {
          siteNameEn: 'Madarik Real Estate',
          siteNameAr: 'مداريك العقارية',
          publicEmail: 'info@madarik.com',
          publicPhone: '+1-555-0123',
          website: 'https://madarik.com',
          country: 'United States',
          city: 'New York',
        },
      });

      console.log('✅ Site settings created:', {
        id: siteSettings.id,
        siteNameEn: siteSettings.siteNameEn,
        siteNameAr: siteSettings.siteNameAr,
      });
    } else {
      console.log('ℹ️  Site settings already exist');
    }

    // Create sample amenities
    const amenitiesData = [
      { key: 'parking', labelEn: 'Parking', labelAr: 'موقف سيارات' },
      { key: 'balcony', labelEn: 'Balcony', labelAr: 'شرفة' },
      { key: 'garden', labelEn: 'Garden', labelAr: 'حديقة' },
      { key: 'pool', labelEn: 'Swimming Pool', labelAr: 'مسبح' },
      { key: 'gym', labelEn: 'Gym', labelAr: 'صالة رياضية' },
      { key: 'elevator', labelEn: 'Elevator', labelAr: 'مصعد' },
      { key: 'security', labelEn: '24/7 Security', labelAr: 'أمن 24/7' },
      { key: 'ac', labelEn: 'Air Conditioning', labelAr: 'تكييف هواء' },
      { key: 'heating', labelEn: 'Central Heating', labelAr: 'تدفئة مركزية' },
      { key: 'furnished', labelEn: 'Furnished', labelAr: 'مفروش' },
      { key: 'internet', labelEn: 'High Speed Internet', labelAr: 'إنترنت عالي السرعة' },
      { key: 'laundry', labelEn: 'Laundry Room', labelAr: 'غرفة غسيل' },
    ];

    for (const amenityData of amenitiesData) {
      const existingAmenity = await prisma.amenity.findUnique({
        where: { key: amenityData.key },
      });

      if (!existingAmenity) {
        await prisma.amenity.create({
          data: amenityData,
        });
      }
    }

    const amenitiesCount = await prisma.amenity.count();
    console.log(`✅ Amenities seeded: ${amenitiesCount} total`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
