import { describe, it, expect, beforeEach } from "vitest";
import { inMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: inMemoryCheckInRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new inMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      user_id: "user-id-1",
      gym_id: "gym-id-1",
    });
    await checkInsRepository.create({
      user_id: "user-id-1",
      gym_id: "gym-id-2",
    });
    const { checkInsCount } = await sut.execute({
      userId: "user-id-1",
    });

    expect(checkInsCount).toEqual(2);
  });
});
