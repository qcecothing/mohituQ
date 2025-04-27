import React from "react";
import { BentoGrid, BentoGridItem } from "$/components/ui/bento-grid";
import {
  IconBarrierBlock,
  IconBuildingLighthouse,
  IconChartDots3,
  IconGitBranch,
  IconMathFunction,
  IconRecycle,
  IconWaveSine,
} from "@tabler/icons-react";

export function VisionGrid() {
  return (
    <section
      className="relative flex flex-col items-center justify-center pb-32"
      id="vision"
    >
      <div className="relative z-10 flex flex-col items-center justify-center w-full py-8 text-2xl font-bold text-center text-black dark:text-white">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
          Our vision
        </h2>
      </div>
      <BentoGrid className="max-w-4xl mx-auto">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </section>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-200 to-teal-100 dark:from-blue-900 dark:to-teal-800">
  </div>
);
const items = [
  {
    title: "The Ocean Crisis",
    description:
      "Over 1 million marine animals die annually from plastic pollution.",
    header: <Skeleton />,
    icon: <IconWaveSine className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Economic Impact",
    description:
      "Ocean plastic pollution costs approximately $32 billion worldwide.",
    header: <Skeleton />,
    icon: <IconChartDots3 className="h-4 w-4 text-red-500" />,
  },
  {
    title: "Current Limitations",
    description:
      "Traditional barrier placement methods are inefficient and costly.",
    header: <Skeleton />,
    icon: <IconBarrierBlock className="h-4 w-4 text-orange-500" />,
  },
  {
    title: "Trajectory Simulation",
    description:
      "Visualizing how plastic flows from cities to oceans reveals complex patterns requiring advanced solutions.",
    header: <Skeleton />,
    icon: <IconGitBranch className="h-4 w-4 text-purple-500" />,
  },
  {
    title: "Quantum Approach",
    description:
      "Formulating barrier placement as a QUBO problem ideal for quantum computing.",
    header: <Skeleton />,
    icon: <IconMathFunction className="h-4 w-4 text-indigo-500" />,
  },
  {
    title: "Optimized Collection",
    description:
      "Our solution captures 55% of plastic with the same resources in just 30 years.",
    header: <Skeleton />,
    icon: <IconRecycle className="h-4 w-4 text-green-500" />,
  },
  {
    title: "Global Solution",
    description:
      "Scalable quantum optimization creating a pathway to cleaner oceans and healthier marine ecosystems.",
    header: <Skeleton />,
    icon: <IconBuildingLighthouse className="h-4 w-4 text-cyan-500" />,
  },
];
