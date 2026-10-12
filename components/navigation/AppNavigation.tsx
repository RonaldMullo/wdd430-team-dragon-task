"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/categories", label: "Categories" },
];

export default function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex flex-wrap gap-2">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
