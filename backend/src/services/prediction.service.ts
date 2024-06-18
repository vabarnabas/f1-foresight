import { CreatePredictionDto } from "../dto/create-prediction.dto";
import { prisma } from "../prisma";

export class PredictionService {
  async findAll() {
    return await prisma.prediction.findMany();
  }

  async findSpecific(id: string) {
    return await prisma.prediction.findUnique({ where: { id } });
  }

  async findByRace(raceId: string) {
    return await prisma.prediction.findMany({ where: { raceId } });
  }

  async findByRaceAndUser(raceId: string, userId: string) {
    return await prisma.prediction.findFirst({ where: { raceId, userId } });
  }

  async findMy(userId: string) {
    return await prisma.prediction.findMany({ where: { userId } });
  }

  async create(dto: CreatePredictionDto) {
    return await prisma.prediction.create({ data: dto });
  }

  async update(id: string, dto: CreatePredictionDto) {
    return await prisma.prediction.update({
      where: { id },
      data: dto,
    });
  }
}
