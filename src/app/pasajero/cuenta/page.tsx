import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { getProfileByEmail } from "@/application/account/get-profile";
import { PrismaAccountRepository } from "@/infrastructure/account/prisma-account-repository";
import { requireRole } from "@/lib/auth/require-role";

import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Mi cuenta" };

async function AccountContent() {
  const sessionUser = await requireRole("PASSENGER");
  const repo = new PrismaAccountRepository();
  const profile = await getProfileByEmail(repo, sessionUser.email);

  return (
    <ProfileForm
      profile={{
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        phone: profile.phone,
        photoUrl: profile.photoUrl,
        privacyAcceptedAtIso: profile.privacyAcceptedAt
          ? profile.privacyAcceptedAt.toISOString()
          : null,
      }}
    />
  );
}

function AccountSkeleton() {
  return (
    <div aria-busy="true" className="space-y-5">
      <div className="border-line h-36 animate-pulse rounded-2xl border bg-white" />
      <div className="border-line h-80 animate-pulse rounded-2xl border bg-white" />
    </div>
  );
}

export default function PassengerAccountPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <Link href="/pasajero" className="text-brand text-xs font-bold hover:underline">
            ← Volver a Pasajero
          </Link>
          <h1 className="font-heading text-ink mt-1 text-2xl font-bold">Mi cuenta</h1>
        </div>
      </header>

      <Suspense fallback={<AccountSkeleton />}>
        <AccountContent />
      </Suspense>
    </main>
  );
}
