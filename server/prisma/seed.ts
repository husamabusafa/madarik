import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed amenities
  const amenities = [
    { key: 'balcony', labelEn: 'Balcony', labelAr: 'شرفة' },
    { key: 'parking', labelEn: 'Parking', labelAr: 'موقف سيارات' },
    { key: 'pool', labelEn: 'Swimming Pool', labelAr: 'مسبح' },
    { key: 'gym', labelEn: 'Gym', labelAr: 'صالة رياضية' },
    { key: 'garden', labelEn: 'Garden', labelAr: 'حديقة' },
    { key: 'elevator', labelEn: 'Elevator', labelAr: 'مصعد' },
    { key: 'security', labelEn: '24/7 Security', labelAr: 'أمن 24/7' },
    { key: 'ac', labelEn: 'Air Conditioning', labelAr: 'تكييف' },
    { key: 'furnished', labelEn: 'Furnished', labelAr: 'مفروش' },
    { key: 'internet', labelEn: 'Internet', labelAr: 'إنترنت' },
    { key: 'maid_room', labelEn: 'Maid Room', labelAr: 'غرفة خادمة' },
    { key: 'storage', labelEn: 'Storage Room', labelAr: 'غرفة تخزين' },
    { key: 'laundry', labelEn: 'Laundry Room', labelAr: 'غرفة غسيل' },
    { key: 'kitchen_appliances', labelEn: 'Kitchen Appliances', labelAr: 'أجهزة مطبخ' },
    { key: 'central_heating', labelEn: 'Central Heating', labelAr: 'تدفئة مركزية' },
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { key: amenity.key },
      update: {},
      create: amenity,
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

