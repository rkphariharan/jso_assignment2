import Link from "next/link";
import type { Route } from "next";

const navItems: { href: Route; label: string }[] = [
  { href: "/", label: "Overview" },
  { href: "/user", label: "User Dashboard" },
  { href: "/hr", label: "HR Consultant" },
  { href: "/admin", label: "Super Admin" },
  { href: "/licensing", label: "Licensing" }
];

export function Nav() {
  return (
    <nav className="nav">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
