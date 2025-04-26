"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

export default function TrajectoryPage() {
  const TrajectoryMap = dynamic(() => import("$/components/trajectory-map"), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        Loading map...
      </div>
    ),
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">
          Plastic Trajectory Visualization
        </h1>
        <p className="mb-6">
          Visualize the movement of plastic particles in the ocean and their
          potential paths. The animation shows how plastic flows from a starting
          point through different environments.
        </p>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-96">
              Loading...
            </div>
          }
        >
          <TrajectoryMap />
        </Suspense>
      </div>
    </div>
  );
}
