import { prisma } from "../prisma";

export class DriverService {
  async findAll() {
    return await prisma.driver.findMany({ include: { team: true } });
  }

  async findSpecific(name: string) {
    return await prisma.driver.findFirst({
      where: { fullName: name },
      include: { team: true },
    });
  }
}
