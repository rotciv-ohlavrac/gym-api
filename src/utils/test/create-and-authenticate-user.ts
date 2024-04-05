import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false
) {
  const userEmail = "johndoe@example.com";
  const userPassword = "123456";

  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: userEmail,
      password_hash: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: userEmail,
    password: userPassword,
  });

  const { token } = authResponse.body;

  return { token };
}
