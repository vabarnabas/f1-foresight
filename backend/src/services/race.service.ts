import { prisma } from "../prisma";

export class RaceService {
  async findAll() {
    return await prisma.race.findMany();
  }

  async findSpecific(id: string) {
    return await prisma.race.findUnique({ where: { id } });
  }

  async findBySeason(season: string) {
    return await prisma.race.findMany({
      where: { season: { name: season } },
      orderBy: { endDate: "asc" },
    });
  }
}
