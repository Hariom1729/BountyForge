import { PrismaClient } from '@prisma/client';

try {
  const prisma = new PrismaClient({ errorFormat: 'minimal' });
  console.log("Success with errorFormat");
} catch (e) {
  console.error(e);
}
