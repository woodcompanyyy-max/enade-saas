const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const courses = [
  { name: 'Administração', category: 'Bacharelado', modality: 'Semipresencial', enadeScore: 3.2, nationalAvg: 3.1, participationRate: 85, idd: 3.4, riskLevel: 'Baixo' },
  { name: 'Biomedicina', category: 'Bacharelado', modality: 'Presencial', enadeScore: 4.1, nationalAvg: 3.5, participationRate: 94, idd: 4.2, riskLevel: 'Baixo' },
  { name: 'Ciências Contábeis', category: 'Bacharelado', modality: 'Semipresencial', enadeScore: 3.8, nationalAvg: 3.2, participationRate: 88, idd: 3.9, riskLevel: 'Baixo' },
  { name: 'Direito', category: 'Bacharelado', modality: 'Presencial', enadeScore: 3.9, nationalAvg: 3.4, participationRate: 92, idd: 3.8, riskLevel: 'Médio' },
  { name: 'Educação Física', category: 'Bacharelado', modality: 'Presencial', enadeScore: 3.5, nationalAvg: 3.2, participationRate: 80, idd: 3.5, riskLevel: 'Médio' },
  { name: 'Enfermagem', category: 'Bacharelado', modality: 'Presencial', enadeScore: 4.2, nationalAvg: 3.6, participationRate: 96, idd: 4.1, riskLevel: 'Baixo' },
  { name: 'Engenharia Civil', category: 'Bacharelado', modality: 'Presencial', enadeScore: 2.8, nationalAvg: 3.3, participationRate: 75, idd: 2.9, riskLevel: 'Alto' },
  { name: 'Psicologia', category: 'Bacharelado', modality: 'Presencial', enadeScore: 3.7, nationalAvg: 3.5, participationRate: 90, idd: 3.6, riskLevel: 'Médio' },
]

async function main() {
  console.log('Start seeding...')
  for (const c of courses) {
    const course = await prisma.course.create({
      data: c,
    })
    console.log(`Created course with id: ${course.id}`)
  }
  console.log('Seeding finished.')
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
