"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import LogoWhite from '@/components/logo/LogoWhite';
import LogoBlack from '@/components/logo/LogoBlack';
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-8">
        <Link href={isDashboard ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <div className="block dark:hidden w-48 h-10">
            <LogoBlack />
          </div>
          <div className="hidden dark:block w-48 h-10">
            <LogoWhite />
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isDashboard ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => window.location.href = "/login"}
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-web-orange hover:bg-web-orange/90 text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}