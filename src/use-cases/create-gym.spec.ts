import { describe, it, expect, beforeEach } from "vitest";
import { inMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: inMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new inMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "Javascript GYM",
      latitude: -23.5510318,
      longitude: -46.6863243,
      phone: null,
      description: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
