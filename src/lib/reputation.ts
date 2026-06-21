import { prisma } from "./prisma";

export const RANKS = [
  { name: "Bronze Developer", minScore: 0 },
  { name: "Silver Developer", minScore: 100 },
  { name: "Gold Developer", minScore: 500 },
  { name: "Platinum Developer", minScore: 1000 },
  { name: "Diamond Developer", minScore: 5000 },
  { name: "OSS Legend", minScore: 10000 },
];

export async function addReputationPoints(userId: string, points: number, action: string) {
  const reputation = await prisma.reputation.upsert({
    where: { userId },
    update: {
      score: { increment: points },
    },
    create: {
      userId,
      score: points,
    },
  });

  // Calculate Rank
  let newRank = RANKS[0].name;
  for (const rank of RANKS) {
    if (reputation.score >= rank.minScore) {
      newRank = rank.name;
    }
  }

  // Update Rank if it changed
  if (reputation.rank !== newRank) {
    await prisma.reputation.update({
      where: { userId },
      data: { rank: newRank },
    });
  }

  // Log the audit action
  await prisma.auditLog.create({
    data: {
      userId,
      action: "REPUTATION_GAINED",
      metadata: { points, newScore: reputation.score, reason: action },
    },
  });

  return reputation;
}

export async function awardBadge(userId: string, badgeName: string) {
  const reputation = await prisma.reputation.findUnique({ where: { userId } });
  
  if (!reputation) return;

  if (!reputation.badges.includes(badgeName)) {
    await prisma.reputation.update({
      where: { userId },
      data: {
        badges: { push: badgeName },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "BADGE_AWARDED",
        metadata: { badge: badgeName },
      },
    });
  }
}
