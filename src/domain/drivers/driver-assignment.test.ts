import { describe, expect, it } from "vitest";

import {
  canStartTrip,
  createDriverAssignment,
  ensureCanAssignDriver,
  unassignDriver,
} from "./driver-assignment";

describe("driver assignment", () => {
  const assignedAt = new Date("2026-11-21T10:00:00");

  it("crea una asignación activa", () => {
    const assignment = createDriverAssignment("driver-1", "vessel-1", assignedAt);

    expect(assignment.driverId).toBe("driver-1");
    expect(assignment.vesselId).toBe("vessel-1");
    expect(assignment.assignedAt).toEqual(assignedAt);
    expect(assignment.unassignedAt).toBeNull();
  });

  it("rechaza una asignación duplicada", () => {
    const assignments = [createDriverAssignment("driver-1", "vessel-1", assignedAt)];

    expect(() => ensureCanAssignDriver(assignments, "driver-1", "vessel-1")).toThrow(
      "El chofer ya está asignado",
    );
  });

  it("permite asignar nuevamente después de retirar al chofer", () => {
    const previousAssignment = unassignDriver(
      createDriverAssignment("driver-1", "vessel-1", assignedAt),
      new Date("2026-11-21T12:00:00"),
    );

    expect(() => ensureCanAssignDriver([previousAssignment], "driver-1", "vessel-1")).not.toThrow();
  });

  it("registra la fecha de retiro", () => {
    const assignment = createDriverAssignment("driver-1", "vessel-1", assignedAt);

    const unassignedAt = new Date("2026-11-21T12:00:00");

    const result = unassignDriver(assignment, unassignedAt);

    expect(result.unassignedAt).toEqual(unassignedAt);
    expect(assignment.unassignedAt).toBeNull();
  });

  it("rechaza retirar una asignación que ya fue retirada", () => {
    const assignment = unassignDriver(
      createDriverAssignment("driver-1", "vessel-1", assignedAt),
      new Date("2026-11-21T12:00:00"),
    );

    expect(() => unassignDriver(assignment, new Date("2026-11-22T12:00:00.000Z"))).toThrow(
      "Esta asignación ya fue retirada",
    );
  });

  it("permite iniciar un viaje si no hay otro en tránsito", () => {
    expect(canStartTrip(false)).toBe(true);
  });

  it("impide iniciar un viaje si ya existe uno en tránsito", () => {
    expect(canStartTrip(true)).toBe(false);
  });
});
