"use client";

import { Atom, BarChart4, Network, Route, Waves } from "lucide-react";
import { GlowingEffect } from "$/components/ui/glowing-effect";

export function OurApproach() {
  return (
    <section
      className="relative z-10 flex w-full flex-col items-center justify-center gap-8 py-16 md:py-32"
      id="solution"
    >
      <div className="relative z-10 flex flex-col items-center justify-center w-full py-8 text-2xl font-bold text-center text-black">
        <h2 className="text-2xl font-bold text-center text-black">
          Our Quantum Solution
        </h2>
      </div>
      <div className="w-full max-w-6xl px-4 md:px-8">
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={
              <Atom className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            }
            title="QUBO Formulation"
            description="Our solution reframes barrier placement as a Quadratic Unconstrained Binary Optimization problem, making it perfectly suited for quantum computing algorithms."
          />

          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={
              <Network className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            }
            title="Trajectory Analysis"
            description="By analyzing complex flow patterns from our simulation data, we identify optimal barrier placement points to intercept maximum plastic waste."
          />

          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={
              <Waves className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            }
            title="55% Improvement"
            description="Our quantum-optimized placement achieves 55% plastic collection in 30 years with the same 200 barriers that would collect only 5% using traditional methods."
          />

          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={
              <BarChart4 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            }
            title="Resource Efficiency"
            description="Quantum optimization maximizes the impact per barrier, dramatically reducing the cost-per-ton of plastic removal and enabling more efficient use of cleanup resources."
          />

          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={
              <Route className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            }
            title="Scalable Implementation"
            description="Our solution adapts to changing conditions through continuous optimization. As waste patterns evolve, our quantum algorithm recalculates optimal barrier placement to maintain maximum efficiency."
          />
        </ul>
      </div>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-blue-200 dark:border-blue-800 p-2 bg-blue-50 dark:bg-blue-900/30">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-indigo-700 md:text-2xl/[1.875rem] dark:text-indigo-300">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-slate-700 md:text-base/[1.375rem] dark:text-slate-300 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
