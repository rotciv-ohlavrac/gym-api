import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUserUseCase } from "@/use-cases/factories/make-authenticate-use-case";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUserUseCase = makeAuthenticateUserUseCase();
    const { user } = await authenticateUserUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id } }
    );

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: "7d" } }
    );

    return reply
      .status(200)
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: true,
      })
      .send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    return reply.status(500).send();
  }
}
