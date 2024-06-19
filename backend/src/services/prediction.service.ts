import { Prediction, Race } from "@prisma/client";
import { CreatePredictionDto } from "../dto/create-prediction.dto";
import { prisma } from "../prisma";
import OpenAI from "openai";
const openai = new OpenAI();
export class PredictionService {
  async findAll() {
    return await prisma.prediction.findMany();
  }

  async findSpecific(id: string) {
    return await prisma.prediction.findUnique({
      where: { id },
      include: {
        race: true,
      },
    });
  }

  async findByRace(raceId: string) {
    return await prisma.prediction.findMany({ where: { raceId } });
  }

  async findByRaceAndUser(raceId: string, userId: string) {
    return await prisma.prediction.findFirst({ where: { raceId, userId } });
  }

  async findPodium(prediction: Prediction) {
    const drivers = await Promise.all(
      prediction.result.map(async (id) => {
        return await prisma.driver.findUnique({
          where: { id },
          include: { team: true },
        });
      })
    );

    return prediction.result.map((id) => drivers.find((d) => d!.id === id));
  }

  async findMy(userId: string) {
    return await prisma.prediction.findMany({
      where: { userId: userId },
      orderBy: { race: { startDate: "asc" } },
    });
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

  async analyze(
    prediction: Prediction & {
      race: { name: string; country: string; city: string };
    }
  ) {
    const podium = await this.findPodium(prediction);

    return await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `
        Analyze the prediction for the 2024 ${prediction.race.name}.

The podium finishers are as follows: 
1. ${podium[0]!.fullName}
2. ${podium[1]!.fullName}
3. ${podium[2]!.fullName}

Use the results from the 2024 and 2023 seasons to support your analysis, with a primary focus on the 2024 season. Provide detailed pro and contra arguments regarding the prediction.

Return the analysis in a structured JSON format with the following keys:
- analysis: string
- goodArguments: string
- onTheOtherHand: string
- conclusion: string

        `,
        },
      ],
      response_format: { type: "json_object" },
    });
  }
}
