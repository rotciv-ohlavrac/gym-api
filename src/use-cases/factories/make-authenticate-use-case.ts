import { AuthenticateUserUseCase } from "@/use-cases/authenticate";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeAuthenticateUserUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    prismaUsersRepository
  );

  return authenticateUserUseCase;
}
