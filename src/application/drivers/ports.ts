import type { DriverAssignment } from "../../domain/drivers/driver-assignment";

/**
 * Información del usuario que puede ser asignado como chofer.
 */
export interface DriverAccount {
  id: string;
  role: string;
  status: string;
  deletedAt: Date | null;
}

/**
 * Información básica de una embarcación.
 */
export interface VesselRecord {
  id: string;
}

/**
 * Asignación almacenada en la base de datos.
 * Incluye el identificador generado por PostgreSQL.
 */
export interface DriverAssignmentRecord extends DriverAssignment {
  id: string;
}

/**
 * Operaciones que necesita la aplicación para administrar
 * las asignaciones de choferes a embarcaciones.
 *
 * Esta interfaz no depende de Prisma.
 */
export interface DriverAssignmentRepository {
  findDriverById(driverId: string): Promise<DriverAccount | null>;

  findVesselById(vesselId: string): Promise<VesselRecord | null>;

  findActiveAssignment(driverId: string, vesselId: string): Promise<DriverAssignmentRecord | null>;

  createAssignment(assignment: DriverAssignment): Promise<DriverAssignmentRecord>;

  findAssignmentById(assignmentId: string): Promise<DriverAssignmentRecord | null>;

  updateUnassignedAt(assignmentId: string, unassignedAt: Date): Promise<DriverAssignmentRecord>;

  listByVessel(vesselId: string): Promise<DriverAssignmentRecord[]>;
}
