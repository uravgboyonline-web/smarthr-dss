const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const employees = await prisma.employee.findMany({ where: { userId: null } });
  
  for (const emp of employees) {
    // create user
    const user = await prisma.user.create({
      data: {
        name: emp.name,
        email: `${emp.employeeCode.toLowerCase()}@smarthr.com`,
        password: 'password123',
        role: 'employee',
      }
    });

    // link to employee
    await prisma.employee.update({
      where: { id: emp.id },
      data: { userId: user.id }
    });
    console.log(`Created user for ${emp.name} with email ${user.email}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
