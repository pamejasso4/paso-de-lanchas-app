import { DomainError } from "../shared/domain-error";

export interface DriverAssignment {
  driverId: string;
  vesselId: string;
  assignedAt: Date;
  unassignedAt: Date | null;
}

/**
 * Comprueba que el chofer no tenga una asignación activa
 * en la misma embarcación.
 */
export function ensureCanAssignDriver(
  assignments: DriverAssignment[],
  driverId: string,
  vesselId: string,
): void {
  const alreadyAssigned = assignments.some(
    (assignment) =>
      assignment.driverId === driverId &&
      assignment.vesselId === vesselId &&
      assignment.unassignedAt === null,
  );

  if (alreadyAssigned) {
    throw new DomainError(
      "DRIVER_ALREADY_ASSIGNED",
      "El chofer ya está asignado a esta embarcación.",
    );
  }
}

/**
 * Crea una nueva asignación de chofer a una embarcación.
 */
export function createDriverAssignment(
  driverId: string,
  vesselId: string,
  assignedAt: Date,
): DriverAssignment {
  return {
    driverId,
    vesselId,
    assignedAt,
    unassignedAt: null,
  };
}

/**
 * Retira al chofer de la embarcación registrando la fecha de baja.
 */
export function unassignDriver(assignment: DriverAssignment, unassignedAt: Date): DriverAssignment {
  if (assignment.unassignedAt !== null) {
    throw new DomainError("DRIVER_ASSIGNMENT_INACTIVE", "Esta asignación ya fue retirada.");
  }

  return {
    ...assignment,
    unassignedAt,
  };
}

/**
 * Un chofer solamente puede iniciar un viaje si no tiene
 * otro viaje en tránsito.
 */
export function canStartTrip(hasTripInTransit: boolean): boolean {
  return !hasTripInTransit;
}
