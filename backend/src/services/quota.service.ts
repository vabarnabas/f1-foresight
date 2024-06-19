import { prisma } from "../prisma";

export class QuotaService {
  async findByUser(userId: string) {
    return await prisma.quota.findUnique({ where: { userId } });
  }

  async createOrUpdate(userId: string) {
    const existingQuota = await this.findByUser(userId);

    if (existingQuota) {
      return await prisma.quota.update({
        where: { userId },
        data: { usedAmount: existingQuota.usedAmount + 1 },
      });
    }

    return await prisma.quota.create({ data: { userId, usedAmount: 1 } });
  }

  async resetQuotas(userId: string) {
    return await prisma.quota.update({
      where: { userId },
      data: { usedAmount: 0 },
    });
  }

  async checkQuota(userId: string) {
    const quota = await this.findByUser(userId);

    if (!quota) {
      return true;
    }

    console.log(process.env.QUOTA_LIMIT);

    return quota.usedAmount < parseInt(process.env.QUOTA_LIMIT!);
  }
}
