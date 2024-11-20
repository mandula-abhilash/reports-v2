"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";

export default function ConfirmationPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 md:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-card p-8 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-conifer" />
            </div>
            <h1 className="text-3xl font-bold">Request Submitted!</h1>
            <p className="text-muted-foreground">
              Your site assessment request has been submitted successfully. We will review your request and get back to you shortly.
            </p>
            <div className="space-y-4">
              <Link href="/dashboard">
                <Button className="w-full bg-web-orange hover:bg-web-orange/90 text-white">
                  Return to Dashboard
                </Button>
              </Link>
              <Link href="/dashboard?tab=my-requests">
                <Button variant="outline" className="w-full">
                  View My Requests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}