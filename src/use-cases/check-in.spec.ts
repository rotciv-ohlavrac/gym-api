import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { inMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { inMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-in";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: inMemoryCheckInRepository;
let gymsRepository: inMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new inMemoryCheckInRepository();
    gymsRepository = new inMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.create({
      id: "gym-id-1",
      title: "Javascript Gym",
      description: null,
      phone: null,
      latitude: new Decimal(-23.5510318),
      longitude: new Decimal(-46.6863243),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(1998, 0, 22, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id-1",
      gymId: "gym-id-1",
      userLatitude: -23.5510318,
      userLongitude: -46.6863243,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(1998, 0, 22, 8, 0, 0));

    await sut.execute({
      userId: "user-id-1",
      gymId: "gym-id-1",
      userLatitude: -23.5510318,
      userLongitude: -46.6863243,
    });

    await expect(() =>
      sut.execute({
        userId: "user-id-1",
        gymId: "gym-id-1",
        userLatitude: -23.5510318,
        userLongitude: -46.6863243,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });
  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(1998, 0, 22, 8, 0, 0));

    await sut.execute({
      userId: "user-id-1",
      gymId: "gym-id-1",
      userLatitude: -23.5510318,
      userLongitude: -46.6863243,
    });

    vi.setSystemTime(new Date(1998, 0, 23, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id-1",
      gymId: "gym-id-1",
      userLatitude: -23.5510318,
      userLongitude: -46.6863243,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });
  it("should not be able to check in on distant gym", async () => {
    vi.setSystemTime(new Date(1998, 0, 22, 8, 0, 0));

    gymsRepository.create({
      id: "gym-id-2",
      title: "Javascript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.553348),
      longitude: new Decimal(-46.6862063),
    });

    await expect(() =>
      sut.execute({
        userId: "user-id-1",
        gymId: "gym-id-2",
        userLatitude: -23.5510318,
        userLongitude: -46.6863243,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
