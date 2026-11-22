import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/infrastructure/db/prisma";
import { PrismaVesselRepository } from "@/infrastructure/fleet/prisma-vessel-repository";
import { createVesselAction } from "../actions";
import { VesselForm } from "../vessel-form";

export const metadata: Metadata = {
  title: "Nueva embarcacion | Administrador",
};

export default async function NuevaEmbarcacionPage() {
  const repo = new PrismaVesselRepository(prisma);
  const vehicleTypes = await repo.listVehicleTypes();

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-ink-muted text-xs font-semibold tracking-wider uppercase">Flota</p>
          <h1 className="font-heading text-ink text-2xl font-bold">Registrar embarcacion</h1>
        </div>

        <Link href="/admin/flota" className="text-brand text-sm font-medium hover:underline">
          ← Volver a flota
        </Link>
      </div>

      <VesselForm mode="create" vehicleTypes={vehicleTypes} action={createVesselAction} />
    </main>
  );
}
