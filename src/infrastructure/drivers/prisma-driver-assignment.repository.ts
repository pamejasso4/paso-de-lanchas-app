import { prisma } from "@/infrastructure/db/prisma";

import type {
  DriverAssignmentRepository,
  DriverAssignmentRecord,
} from "@/application/drivers/ports";

import type { DriverAssignment } from "@/domain/drivers/driver-assignment";

/**
 * Convierte el registro de Prisma al formato que utiliza la aplicación.
 */
function toAssignmentRecord(record: {
  id: string;
  driverId: string;
  vesselId: string;
  assignedAt: Date;
  unassignedAt: Date | null;
}): DriverAssignmentRecord {
  return {
    id: record.id,
    driverId: record.driverId,
    vesselId: record.vesselId,
    assignedAt: record.assignedAt,
    unassignedAt: record.unassignedAt,
  };
}

export class PrismaDriverAssignmentRepository implements DriverAssignmentRepository {
  async findDriverById(driverId: string) {
    return prisma.user.findUnique({
      where: { id: driverId },
      select: {
        id: true,
        role: true,
        status: true,
        deletedAt: true,
      },
    });
  }

  async findVesselById(vesselId: string) {
    return prisma.vessel.findUnique({
      where: { id: vesselId },
      select: {
        id: true,
      },
    });
  }

  async findActiveAssignment(
    driverId: string,
    vesselId: string,
  ): Promise<DriverAssignmentRecord | null> {
    const assignment = await prisma.vesselDriver.findFirst({
      where: {
        driverId,
        vesselId,
        unassignedAt: null,
      },
    });

    return assignment ? toAssignmentRecord(assignment) : null;
  }

  async createAssignment(assignment: DriverAssignment): Promise<DriverAssignmentRecord> {
    const created = await prisma.vesselDriver.create({
      data: {
        driverId: assignment.driverId,
        vesselId: assignment.vesselId,
        assignedAt: assignment.assignedAt,
        unassignedAt: assignment.unassignedAt,
      },
    });

    return toAssignmentRecord(created);
  }

  async findAssignmentById(assignmentId: string): Promise<DriverAssignmentRecord | null> {
    const assignment = await prisma.vesselDriver.findUnique({
      where: { id: assignmentId },
    });

    return assignment ? toAssignmentRecord(assignment) : null;
  }

  async updateUnassignedAt(
    assignmentId: string,
    unassignedAt: Date,
  ): Promise<DriverAssignmentRecord> {
    const updated = await prisma.vesselDriver.update({
      where: { id: assignmentId },
      data: { unassignedAt },
    });

    return toAssignmentRecord(updated);
  }

  async listByVessel(vesselId: string): Promise<DriverAssignmentRecord[]> {
    const assignments = await prisma.vesselDriver.findMany({
      where: { vesselId },
      orderBy: { assignedAt: "desc" },
    });

    return assignments.map(toAssignmentRecord);
  }
}
