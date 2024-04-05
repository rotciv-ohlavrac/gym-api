import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymUseCase } from "../search-gym";

export function makeSearchGymUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository();
  const searchGymsUseCase = new SearchGymUseCase(prismaGymsRepository);
  return searchGymsUseCase;
}
