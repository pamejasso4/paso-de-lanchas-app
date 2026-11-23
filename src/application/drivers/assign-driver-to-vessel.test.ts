import { describe, expect, it, vi } from "vitest";

import { createAssignDriverToVessel } from "./assign-driver-to-vessel";

import type { DriverAssignment } from "@/domain/drivers/driver-assignment";

import type { DriverAssignmentRepository } from "./ports";

describe("assign driver to vessel", () => {
  const assignedAt = new Date("2026-11-21T10:00:00");

  function createRepository(): DriverAssignmentRepository {
    return {
      findDriverById: vi.fn(async () => ({
        id: "driver-1",
        role: "DRIVER",
        status: "ACTIVE",
        deletedAt: null,
      })),

      findVesselById: vi.fn(async () => ({
        id: "vessel-1",
      })),

      findActiveAssignment: vi.fn(async () => null),

      createAssignment: vi.fn(async (assignment: DriverAssignment) => ({
        id: "assignment-1",
        ...assignment,
      })),

      findAssignmentById: vi.fn(async () => null),

      updateUnassignedAt: vi.fn(),

      listByVessel: vi.fn(async () => []),
    };
  }

  const clock = {
    now: () => assignedAt,
  };

  it("asigna correctamente un chofer a una embarcación", async () => {
    const repository = createRepository();

    const execute = createAssignDriverToVessel(repository, clock);

    const result = await execute({
      driverId: "driver-1",
      vesselId: "vessel-1",
    });

    expect(result.id).toBe("assignment-1");
    expect(result.driverId).toBe("driver-1");
    expect(result.vesselId).toBe("vessel-1");
    expect(result.assignedAt).toEqual(assignedAt);
    expect(result.unassignedAt).toBeNull();

    expect(repository.createAssignment).toHaveBeenCalledOnce();
  });

  it("rechaza un chofer que no existe", async () => {
    const repository = createRepository();

    vi.mocked(repository.findDriverById).mockResolvedValue(null);

    const execute = createAssignDriverToVessel(repository, clock);

    await expect(
      execute({
        driverId: "driver-1",
        vesselId: "vessel-1",
      }),
    ).rejects.toMatchObject({
      code: "DRIVER_NOT_FOUND",
    });
  });

  it("rechaza un usuario que no tiene el rol DRIVER", async () => {
    const repository = createRepository();

    vi.mocked(repository.findDriverById).mockResolvedValue({
      id: "user-1",
      role: "PASSENGER",
      status: "ACTIVE",
      deletedAt: null,
    });

    const execute = createAssignDriverToVessel(repository, clock);

    await expect(
      execute({
        driverId: "user-1",
        vesselId: "vessel-1",
      }),
    ).rejects.toMatchObject({
      code: "USER_NOT_DRIVER",
    });
  });

  it("rechaza un chofer que no está activo", async () => {
    const repository = createRepository();

    vi.mocked(repository.findDriverById).mockResolvedValue({
      id: "driver-1",
      role: "DRIVER",
      status: "BLOCKED",
      deletedAt: null,
    });

    const execute = createAssignDriverToVessel(repository, clock);

    await expect(
      execute({
        driverId: "driver-1",
        vesselId: "vessel-1",
      }),
    ).rejects.toMatchObject({
      code: "DRIVER_NOT_ACTIVE",
    });
  });

  it("rechaza un chofer eliminado", async () => {
    const repository = createRepository();

    vi.mocked(repository.findDriverById).mockResolvedValue({
      id: "driver-1",
      role: "DRIVER",
      status: "ACTIVE",
      deletedAt: new Date("2026-11-20T10:00:00"),
    });

    const execute = createAssignDriverToVessel(repository, clock);

    await expect(
      execute({
        driverId: "driver-1",
        vesselId: "vessel-1",
      }),
    ).rejects.toMatchObject({
      code: "DRIVER_NOT_ACTIVE",
    });
  });

  it("rechaza una embarcación que no existe", async () => {
    const repository = createRepository();

    vi.mocked(repository.findVesselById).mockResolvedValue(null);

    const execute = createAssignDriverToVessel(repository, clock);

    await expect(
      execute({
        driverId: "driver-1",
        vesselId: "vessel-1",
      }),
    ).rejects.toMatchObject({
      code: "VESSEL_NOT_FOUND",
    });
  });

  it("rechaza una asignación duplicada", async () => {
    const repository = createRepository();

    vi.mocked(repository.findActiveAssignment).mockResolvedValue({
      id: "assignment-1",
      driverId: "driver-1",
      vesselId: "vessel-1",
      assignedAt,
      unassignedAt: null,
    });

    const execute = createAssignDriverToVessel(repository, clock);

    await expect(
      execute({
        driverId: "driver-1",
        vesselId: "vessel-1",
      }),
    ).rejects.toMatchObject({
      code: "DRIVER_ALREADY_ASSIGNED",
    });
  });
});
