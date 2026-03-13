import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "JSO Assignment 2 Prototype",
  description: "Code Portfolio Evaluation Agent prototype"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
