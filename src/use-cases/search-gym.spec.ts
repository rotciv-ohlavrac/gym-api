import { describe, it, expect, beforeEach } from "vitest";
import { inMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymUseCase } from "./search-gym";

let gymsRepository: inMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new inMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "Javascript GYM",
      latitude: -23.5510318,
      longitude: -46.6863243,
      phone: null,
      description: null,
    });
    await gymsRepository.create({
      title: "Typescript GYM",
      latitude: -23.5510318,
      longitude: -46.6863243,
      phone: null,
      description: null,
    });

    const { gyms } = await sut.execute({ query: "Javascript", page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript GYM" }),
    ]);
  });
  it("should be able to search paginated gyms", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript GYM ${i}`,
        latitude: -23.5510318,
        longitude: -46.6863243,
        phone: null,
        description: null,
      });
    }

    const { gyms } = await sut.execute({ query: "Javascript", page: 2 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript GYM 21" }),
      expect.objectContaining({ title: "Javascript GYM 22" }),
    ]);
  });
});
