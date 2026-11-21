import { DomainError } from "@/domain/shared/domain-error";

import { createDriverAssignment, ensureCanAssignDriver } from "@/domain/drivers/driver-assignment";

import type { DriverAssignmentRepository } from "./ports";

import { systemClock } from "@/application/shared/ports";

import type { Clock } from "@/application/shared/ports";

/**
 * Datos necesarios para asignar un chofer a una embarcación.
 */
export interface AssignDriverToVesselInput {
  driverId: string;
  vesselId: string;
}

/**
 * Caso de uso: asignar un chofer a una embarcación.
 */
export function createAssignDriverToVessel(
  repository: DriverAssignmentRepository,
  clock: Clock = systemClock,
) {
  return async function execute(input: AssignDriverToVesselInput) {
    // 1. Comprobar que el chofer exista.
    const driver = await repository.findDriverById(input.driverId);

    if (!driver) {
      throw new DomainError("DRIVER_NOT_FOUND", "El chofer no existe.");
    }

    // 2. Comprobar que tenga el rol DRIVER.
    if (driver.role !== "DRIVER") {
      throw new DomainError(
        "USER_NOT_DRIVER",
        "El usuario seleccionado no tiene el rol de chofer.",
      );
    }

    // 3. Comprobar que esté activo y no haya sido eliminado.
    if (driver.status !== "ACTIVE" || driver.deletedAt !== null) {
      throw new DomainError("DRIVER_NOT_ACTIVE", "El chofer no está activo.");
    }

    // 4. Comprobar que la embarcación exista.
    const vessel = await repository.findVesselById(input.vesselId);

    if (!vessel) {
      throw new DomainError("VESSEL_NOT_FOUND", "La embarcación no existe.");
    }

    // 5. Comprobar que no exista una asignación activa.
    const activeAssignment = await repository.findActiveAssignment(input.driverId, input.vesselId);

    ensureCanAssignDriver(
      activeAssignment ? [activeAssignment] : [],
      input.driverId,
      input.vesselId,
    );

    // 6. Crear y guardar la asignación.
    const assignment = createDriverAssignment(input.driverId, input.vesselId, clock.now());

    return repository.createAssignment(assignment);
  };
}
