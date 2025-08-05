"use client";

import { LandingHero } from "@/components/home/landingHero";
import { LandingFeatures } from "@/components/home/landingFeatures";
import { LandingCTA } from "@/components/home/landingCTA";

export default function HomePage() {
  return (
  <div className="min-h-screen bg-white">
    <LandingHero />
    <LandingFeatures />
    <LandingCTA />
  </div>
  )
}
