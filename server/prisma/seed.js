import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing old data...');
  await prisma.media.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creating test user...');
  const hashedPw = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPw,
      name: 'Test User'
    },
  });

  console.log('🎬 Inserting dummy media...');
  const dummyMedia = Array.from({ length: 100 }).map((_, i) => ({
    title: `Sample Movie ${i + 1}`,
    type: i % 2 === 0 ? 'MOVIE' : 'TVSHOW',
    director: `Director ${i + 1}`,
    budget: `$${(10 + i) * 1}M`,
    location: `Location ${i + 1}`,
    duration: `${100 + i} min`,
    yearOrTime: `20${10 + (i % 15)}`,
    description: `This is a sample description for movie number ${i + 1}.`,
    posterUrl: '',
    createdBy: user.id,
  }));

  await prisma.media.createMany({ data: dummyMedia });

  console.log('100 dummy records inserted successfully!');
}

main()
  .catch((err) => {
    console.error(' Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
