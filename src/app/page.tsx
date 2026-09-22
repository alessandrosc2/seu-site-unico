"use client";

import dynamic from "next/dynamic";

const OrbitDeliveryHero = dynamic(
  () => import("@/components/ui/orbit-delivery-hero"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#f6f9ff]">
      <OrbitDeliveryHero />
    </main>
  );
}
