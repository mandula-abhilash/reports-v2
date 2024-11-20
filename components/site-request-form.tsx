"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const siteRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  businessName: z.string().min(1, "Business name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  siteName: z.string().min(1, "Site name is required"),
  siteLocation: z.string().min(1, "Site location is required"),
});

export function SiteRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof siteRequestSchema>>({
    resolver: zodResolver(siteRequestSchema),
  });

  const onSubmit = async (data: z.infer<typeof siteRequestSchema>) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Request Submitted",
        description: "Your site assessment request has been submitted successfully.",
      });
      
      router.push("/dashboard/confirmation");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Please try again later.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            {...register("businessName")}
            className={errors.businessName ? "border-destructive" : ""}
          />
          {errors.businessName && (
            <p className="text-sm text-destructive">{errors.businessName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            {...register("contactEmail")}
            className={errors.contactEmail ? "border-destructive" : ""}
          />
          {errors.contactEmail && (
            <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            {...register("siteName")}
            className={errors.siteName ? "border-destructive" : ""}
          />
          {errors.siteName && (
            <p className="text-sm text-destructive">{errors.siteName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteLocation">Site Location</Label>
          <Input
            id="siteLocation"
            {...register("siteLocation")}
            className={errors.siteLocation ? "border-destructive" : ""}
          />
          {errors.siteLocation && (
            <p className="text-sm text-destructive">{errors.siteLocation.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-web-orange hover:bg-web-orange/90 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}