"use client";
import React from "react";
import { FloatingNav } from "$/components/ui/floating-navbar";
import {
  IconApps,
  IconHome,
  IconMessage,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

export function Navbar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500" />,
    },
    {
      name: "Vision",
      link: "/#vision",
      icon: <IconUser className="h-4 w-4 text-neutral-500" />,
    },
    {
      name: "State",
      link: "/#state",
      icon: <IconMessage className="h-4 w-4 text-neutral-500" />,
    },
    {
      name: "Solution",
      link: "/#solution",
      icon: <IconSettings className="h-4 w-4 text-neutral-500" />,
    },
    {
      name: "App",
      link: "/trajectory",
      icon: <IconApps className="h-4 w-4 text-neutral-500" />,
    },
  ];

  return (
    <div className="relative  w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}
