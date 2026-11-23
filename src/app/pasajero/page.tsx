import type { Metadata } from "next";
import Link from "next/link";

import { ModulePlaceholder } from "@/components/module-placeholder";
import { requireRole } from "@/lib/auth/require-role";

export const metadata: Metadata = { title: "Pasajero" };

export default async function PassengerPage() {
  const user = await requireRole("PASSENGER");
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="px-6 pt-6">
        <Link
          href="/pasajero/cuenta"
          className="border-brand/20 text-brand hover:border-brand flex items-center justify-between rounded-2xl border bg-white px-5 py-4 shadow-xs transition"
        >
          <div>
            <p className="font-heading text-brand text-base font-bold">
              Mi cuenta y aviso de privacidad
            </p>
            <p className="text-ink-muted text-xs">
              Consulta y edita tus datos personales (RF-014 y RF-015)
            </p>
          </div>
          <span className="text-brand text-sm font-bold">Abrir →</span>
        </Link>
      </div>

      <ModulePlaceholder
        userName={user.fullName}
        role="Pasajero"
        modules={[
          { name: "Cuenta y perfil", owner: "José", requirements: "RF-014 a RF-020" },
          { name: "Saldo y recargas", owner: "Cova", requirements: "RF-021 a RF-031" },
          { name: "Código QR de abordaje", owner: "Diego", requirements: "RF-032 a RF-038" },
          { name: "Galería de vehículos", owner: "José", requirements: "RF-039 a RF-042" },
          { name: "Mapa y rastreo en vivo", owner: "Diego", requirements: "RF-077 a RF-081" },
          { name: "Información al pasajero", owner: "José", requirements: "RF-082 a RF-087" },
          { name: "Notificaciones", owner: "José", requirements: "RF-106 a RF-109" },
        ]}
      />
    </div>
  );
}
