import { describe, it, expect, beforeEach } from "vitest";
import { RegisterUserUseCase } from "./register";
import { compare } from "bcryptjs";
import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRespository: inMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRespository = new inMemoryUsersRepository();
    sut = new RegisterUserUseCase(usersRespository);
  });
  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const userPassword = "123456";

    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: userPassword,
    });

    const isPasswordCorrectlyHashed = await compare(
      userPassword,
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should hash user password upon registration", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
