import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { inMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInsRepository: inMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check In Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new inMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate check in", async () => {
    vi.setSystemTime(new Date(1998, 0, 22, 8, 0, 0));

    const createdCheckIn = await checkInsRepository.create({
      user_id: "user-id-1",
      gym_id: "gym-id-2",
    });

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });
  it("should not be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({ checkInId: "check-in-id-1" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(1998, 0, 22, 12, 0, 0));

    const createdCheckIn = await checkInsRepository.create({
      user_id: "user-id-1",
      gym_id: "gym-id-2",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
