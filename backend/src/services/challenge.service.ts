import { PrismaClient, Challenge } from '@prisma/client';

const prisma = new PrismaClient();

export class ChallengeService {
  async createChallenge(
    userId: string,
    title: string,
    description: string,
    reward: number
  ): Promise<Challenge> {
    return prisma.challenge.create({
      data: {
        userId,
        title,
        description,
        reward
      }
    });
  }

  async getChallengesByUserId(userId: string): Promise<Challenge[]> {
    return prisma.challenge.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateChallengeProgress(challengeId: string, progress: number): Promise<Challenge> {
    return prisma.challenge.update({
      where: { id: challengeId },
      data: {
        progress,
        completed: progress >= 100
      }
    });
  }

  async completeChallenge(challengeId: string): Promise<Challenge> {
    return prisma.challenge.update({
      where: { id: challengeId },
      data: {
        progress: 100,
        completed: true
      }
    });
  }
}
