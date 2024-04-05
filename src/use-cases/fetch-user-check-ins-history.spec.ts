import { describe, it, expect, beforeEach } from "vitest";
import { inMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInsRepository: inMemoryCheckInRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch User Check-in History Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new inMemoryCheckInRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
  });

  it("should be able to fetch check-in history", async () => {
    await checkInsRepository.create({
      user_id: "user-id-1",
      gym_id: "gym-id-1",
    });
    await checkInsRepository.create({
      user_id: "user-id-1",
      gym_id: "gym-id-2",
    });
    const { checkIns } = await sut.execute({ userId: "user-id-1", page: 1 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-id-1" }),
      expect.objectContaining({ gym_id: "gym-id-2" }),
    ]);
  });
  it("should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: "user-id-1",
        gym_id: `gym-id-${i}`,
      });
    }

    const { checkIns } = await sut.execute({ userId: "user-id-1", page: 2 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-id-21" }),
      expect.objectContaining({ gym_id: "gym-id-22" }),
    ]);
  });
});
