"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DashboardNav } from "@/components/dashboard-nav";
import { SiteRequestForm } from "@/components/site-request-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("new-request");

  return (
    <MainLayout>
      <div className="px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="space-y-6">
            {activeTab === "new-request" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">New Site Assessment Request</h2>
                <SiteRequestForm />
              </div>
            )}
            
            {activeTab === "my-requests" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Requests</h2>
                <div className="rounded-lg border bg-card">
                  <div className="p-6 text-center text-muted-foreground">
                    No requests found.
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <div className="rounded-lg border bg-card p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  <Button className="bg-web-orange hover:bg-web-orange/90 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </MainLayout>
  );
}