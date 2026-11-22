import { z } from "zod";
import { VESSEL_KINDS, VESSEL_STATUSES } from "@/domain/fleet/vessel";

export const vehicleCapacitySchema = z.object({
  vehicleTypeId: z.number().int().positive(),
  capacity: z
    .number()
    .int("La capacidad vehicular debe ser un numero entero.")
    .min(0, "La capacidad vehicular no puede ser negativa."),
});

export const vesselFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "El codigo es obligatorio.")
    .max(10, "El codigo no puede exceder 10 caracteres."),
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(60, "El nombre no puede exceder 60 caracteres."),
  kind: z.enum(VESSEL_KINDS),
  registration: z
    .string()
    .trim()
    .min(1, "La matricula es obligatoria.")
    .max(30, "La matricula no puede exceder 30 caracteres."),
  color: z
    .string()
    .trim()
    .max(30, "El color no puede exceder 30 caracteres.")
    .optional()
    .nullable(),
  photoUrl: z
    .string()
    .trim()
    .url("La URL de la fotografia no es valida.")
    .optional()
    .nullable()
    .or(z.literal("")),
  passengerCapacity: z
    .number()
    .int("La capacidad de pasajeros debe ser entera.")
    .positive("La capacidad de pasajeros debe ser mayor a 0."),
  vehicleCapacities: z.array(vehicleCapacitySchema).optional().default([]),
});

export const listVesselsFilterSchema = z.object({
  kind: z.enum(VESSEL_KINDS).optional(),
  status: z.enum(VESSEL_STATUSES).optional(),
});

export type VesselFormInput = z.input<typeof vesselFormSchema>;
export type ParsedVesselFormInput = z.output<typeof vesselFormSchema>;
export type ListVesselsFilterInput = z.input<typeof listVesselsFilterSchema>;
