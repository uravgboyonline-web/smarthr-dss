const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', users);
  if (users.length === 0) {
    console.log('No users found. Seeding admin user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'admin@smarthr.com',
        name: 'Administrator',
        password: hashedPassword,
        role: 'Admin'
      }
    });
    console.log('Admin user created:', user);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
