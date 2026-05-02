const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Clear existing
  await prisma.evaluationDetail.deleteMany()
  await prisma.evaluation.deleteMany()
  await prisma.evaluationPeriod.deleteMany()
  await prisma.indicator.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Admin User
  // Normally passwords should be hashed with bcrypt, but we'll store plaintext 'password'
  // for this quick prototype seed, or use a known hash. 
  // For NextAuth with Credentials, let's just insert a dummy user. We will use bcrypt later.
  const admin = await prisma.user.create({
    data: {
      name: 'Admin DSS',
      email: 'admin@smarthr.com',
      password: 'password123', // In real app: hash this
      role: 'admin',
    },
  })
  
  const hr = await prisma.user.create({
    data: {
      name: 'HR Manager',
      email: 'hr@smarthr.com',
      password: 'password123',
      role: 'hr',
    },
  })

  // 2. Create Employees
  await prisma.employee.createMany({
    data: [
      { employeeCode: 'EMP-001', name: 'Budi Santoso', position: 'Senior Developer', department: 'IT', joinDate: new Date('2022-01-15'), status: 'Aktif' },
      { employeeCode: 'EMP-002', name: 'Siti Aminah', position: 'UI/UX Designer', department: 'Design', joinDate: new Date('2023-03-10'), status: 'Aktif' },
      { employeeCode: 'EMP-003', name: 'Andi Wijaya', position: 'Marketing Specialist', department: 'Marketing', joinDate: new Date('2021-06-20'), status: 'Aktif' },
      { employeeCode: 'EMP-004', name: 'Rina Kusuma', position: 'HR Manager', department: 'HR', joinDate: new Date('2020-11-05'), status: 'Aktif' },
      { employeeCode: 'EMP-005', name: 'Doni Pratama', position: 'Sales Executive', department: 'Sales', joinDate: new Date('2024-01-10'), status: 'Nonaktif' },
    ]
  })

  // 3. Create Indicators
  await prisma.indicator.createMany({
    data: [
      { name: 'Pencapaian Target', type: 'Kinerja', weight: 30, description: 'Tingkat penyelesaian target yang diberikan' },
      { name: 'Kualitas Kerja', type: 'Kinerja', weight: 20, description: 'Akurasi dan kualitas hasil kerja' },
      { name: 'Kerja Sama', type: 'Perilaku', weight: 20, description: 'Kemampuan berkolaborasi dengan tim' },
      { name: 'Inisiatif', type: 'Perilaku', weight: 15, description: 'Proaktif dalam memberikan solusi' },
      { name: 'Disiplin', type: 'Perilaku', weight: 15, description: 'Ketepatan waktu dan kepatuhan aturan' },
    ]
  })

  // 4. Create Evaluation Periods (Bulanan Januari - Desember)
  await prisma.evaluationPeriod.createMany({
    data: [
      { periodName: 'Periode Januari 2026', startDate: new Date('2026-01-01'), endDate: new Date('2026-01-31'), status: 'closed' },
      { periodName: 'Periode Februari 2026', startDate: new Date('2026-02-01'), endDate: new Date('2026-02-28'), status: 'closed' },
      { periodName: 'Periode Maret 2026', startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31'), status: 'closed' },
      { periodName: 'Periode April 2026', startDate: new Date('2026-04-01'), endDate: new Date('2026-04-30'), status: 'closed' },
      { periodName: 'Periode Mei 2026', startDate: new Date('2026-05-01'), endDate: new Date('2026-05-31'), status: 'aktif' },
      { periodName: 'Periode Juni 2026', startDate: new Date('2026-06-01'), endDate: new Date('2026-06-30'), status: 'aktif' },
      { periodName: 'Periode Juli 2026', startDate: new Date('2026-07-01'), endDate: new Date('2026-07-31'), status: 'aktif' },
      { periodName: 'Periode Agustus 2026', startDate: new Date('2026-08-01'), endDate: new Date('2026-08-31'), status: 'aktif' },
      { periodName: 'Periode September 2026', startDate: new Date('2026-09-01'), endDate: new Date('2026-09-30'), status: 'aktif' },
      { periodName: 'Periode Oktober 2026', startDate: new Date('2026-10-01'), endDate: new Date('2026-10-31'), status: 'aktif' },
      { periodName: 'Periode November 2026', startDate: new Date('2026-11-01'), endDate: new Date('2026-11-30'), status: 'aktif' },
      { periodName: 'Periode Desember 2026', startDate: new Date('2026-12-01'), endDate: new Date('2026-12-31'), status: 'aktif' },
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
