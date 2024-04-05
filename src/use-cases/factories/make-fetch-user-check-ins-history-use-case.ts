import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history";

export function makeFetchUserCheckInsHistoryUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository();
  const fetchUserCheckInsHIstoryUseCase = new FetchUserCheckInsHistoryUseCase(
    prismaCheckInsRepository
  );

  return fetchUserCheckInsHIstoryUseCase;
}
