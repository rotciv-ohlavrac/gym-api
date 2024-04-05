import { Prisma, User } from "@prisma/client";

interface UsersRespository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
}

export { UsersRespository };
