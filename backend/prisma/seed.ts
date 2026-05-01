import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  { name: "Classic Haircut", durationMinutes: 30, price: 40 },
  { name: "Haircut & Beard Trim", durationMinutes: 60, price: 60 },
  { name: "Beard Grooming", durationMinutes: 30, price: 35 },
  { name: "Head Shave", durationMinutes: 30, price: 45 },
  { name: "Hair Coloring", durationMinutes: 90, price: 120 },
  { name: "Hair Wash & Styling", durationMinutes: 30, price: 25 },
  { name: "Kids Haircut", durationMinutes: 30, price: 30 },
  { name: "Premium Package", durationMinutes: 60, price: 90 },
];

async function main() {
  const existing = await prisma.service.findMany({ select: { name: true } });
  const existingNames = new Set(existing.map((s) => s.name));

  const toCreate = services.filter((s) => !existingNames.has(s.name));

  if (toCreate.length === 0) {
    console.log("Services already seeded, skipping.");
    return;
  }

  await prisma.service.createMany({ data: toCreate });
  console.log(`Seeded ${toCreate.length} service(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
