import { PrismaClient } from '@prisma/client';
import config from './prisma.config.ts';

try {
  const prisma = new PrismaClient(config as any);
  console.log("Success");
} catch (e) {
  console.error(e);
}
