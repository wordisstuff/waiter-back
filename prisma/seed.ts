import 'dotenv/config';

import { PrismaClient, TableStatus } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'ai-demo' },

    update: {},

    create: {
      name: 'AI Demo Restaurant',

      slug: 'ai-demo',
    },
  });

  const tables = [
    { number: 1, seats: 2, posX: 10, posY: 10 },

    { number: 2, seats: 2, posX: 30, posY: 10 },

    { number: 3, seats: 4, posX: 50, posY: 10 },

    { number: 4, seats: 4, posX: 70, posY: 10 },

    { number: 5, seats: 6, posX: 50, posY: 40 },
  ];

  for (const table of tables) {
    await prisma.restaurantTable.create({
      data: {
        restaurantId: restaurant.id,

        number: table.number,

        seats: table.seats,

        posX: table.posX,

        posY: table.posY,

        status: TableStatus.FREE,
      },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
