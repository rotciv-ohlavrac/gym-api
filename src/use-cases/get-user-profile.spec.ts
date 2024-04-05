import { describe, it, expect, beforeEach } from "vitest";
import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found";

let usersRespository: inMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRespository = new inMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRespository);
  });
  it("should be able to get user profile", async () => {
    const userName = "John Doe";

    const createdUser = await usersRespository.create({
      name: userName,
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.name).toEqual(userName);
  });
  it("should not be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({ userId: "not-existing-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
