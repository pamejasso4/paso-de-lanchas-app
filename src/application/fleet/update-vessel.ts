import { DomainError } from "@/domain/shared/domain-error";
import { validateVesselRules } from "@/domain/fleet/vessel";
import { vesselFormSchema, type VesselFormInput } from "./vessel-input";
import type { VesselDetail, VesselRepository } from "./vessel-ports";

export function createUpdateVessel(repo: VesselRepository) {
  return async function updateVessel(id: string, rawInput: VesselFormInput): Promise<VesselDetail> {
    const cleanId = id.trim();
    if (!cleanId) {
      throw new DomainError(
        "INVALID_VESSEL_ID",
        "El identificador de la embarcacion es obligatorio.",
      );
    }

    const existing = await repo.findById(cleanId);
    if (!existing) {
      throw new DomainError("VESSEL_NOT_FOUND", `No se encontro la embarcacion con id ${cleanId}.`);
    }

    const parsed = vesselFormSchema.safeParse(rawInput);
    if (!parsed.success) {
      throw new DomainError(
        "INVALID_VESSEL_INPUT",
        parsed.error.issues[0]?.message ?? "Datos de embarcacion invalidos.",
      );
    }

    const valid = validateVesselRules({
      code: parsed.data.code,
      name: parsed.data.name,
      kind: parsed.data.kind,
      registration: parsed.data.registration,
      passengerCapacity: parsed.data.passengerCapacity,
      vehicleCapacities: parsed.data.vehicleCapacities,
    });

    const color = parsed.data.color?.trim() ? parsed.data.color.trim() : null;
    const photoUrl = parsed.data.photoUrl?.trim() ? parsed.data.photoUrl.trim() : null;

    return repo.update({
      id: existing.id,
      ...valid,
      color,
      photoUrl,
    });
  };
}
