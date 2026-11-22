import { DomainError } from "@/domain/shared/domain-error";
import { validateVesselRules } from "@/domain/fleet/vessel";
import { vesselFormSchema, type VesselFormInput } from "./vessel-input";
import type { VesselDetail, VesselRepository } from "./vessel-ports";

export function createCreateVessel(repo: VesselRepository) {
  return async function createVessel(rawInput: VesselFormInput): Promise<VesselDetail> {
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

    return repo.create({
      ...valid,
      color,
      photoUrl,
    });
  };
}
