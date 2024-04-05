import { describe, it, expect, beforeEach } from "vitest";
import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { AuthenticateUserUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { hash } from "bcryptjs";

let usersRespository: inMemoryUsersRepository;
let sut: AuthenticateUserUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRespository = new inMemoryUsersRepository();
    sut = new AuthenticateUserUseCase(usersRespository);
  });
  it("should be able to authenticate", async () => {
    await usersRespository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
  it("should not be able to authenticate with wrong email", async () => {
    await usersRespository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123457",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
