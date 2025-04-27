"use client";

import React from "react";
import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";

export function TrajectoryHeader() {
  return (
    <div className="w-full bg-neutral-800 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">
            <span className="bg-gradient-to-r from-fuchsia-500 via-amber-500 to-pink-400 bg-clip-text text-transparent">
              محيطك
            </span>
          </Link>
        </div>

        <Link
          href="https://github.com/qcecothing/mohituQ"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <IconBrandGithub size={24} />
        </Link>
      </div>
    </div>
  );
}
