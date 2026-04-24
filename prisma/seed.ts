import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@enade.com' },
    update: {},
    create: {
      email: 'admin@enade.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create professor user
  const profPassword = await bcrypt.hash('prof123', 10);
  const professor = await prisma.user.upsert({
    where: { email: 'professor@enade.com' },
    update: {},
    create: {
      email: 'professor@enade.com',
      name: 'Professor Silva',
      password: profPassword,
      role: 'PROFESSOR',
    },
  });
  console.log(`Created professor user: ${professor.email}`);

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
