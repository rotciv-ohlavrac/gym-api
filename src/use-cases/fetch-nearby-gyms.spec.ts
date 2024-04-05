import { describe, it, expect, beforeEach } from "vitest";
import { inMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: inMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch User Check-in History Use Case", () => {
  beforeEach(() => {
    gymsRepository = new inMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able find nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near GYM",
      latitude: -23.5510318,
      longitude: -46.6863243,
      phone: null,
      description: null,
    });
    await gymsRepository.create({
      title: "Far GYM",
      latitude: -23.3135165,
      longitude: -46.5783531,
      phone: null,
      description: null,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.5510318,
      userLongitude: -46.6863243,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near GYM" })]);
  });
});
