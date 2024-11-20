"use client";

import { cn } from "@/lib/utils";
import { FileText, User } from "lucide-react";
import { Button } from "./ui/button";

interface DashboardNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardNav({ activeTab, setActiveTab }: DashboardNavProps) {
  const navItems = [
    {
      id: "new-request",
      label: "New Request",
      icon: FileText,
    },
    {
      id: "my-requests",
      label: "My Requests",
      icon: FileText,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === item.id && "bg-secondary"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}