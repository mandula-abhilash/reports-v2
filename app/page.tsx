import { Button } from "@/components/ui/button";
import { ClipboardList, BarChart3, MapPin } from "lucide-react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";

export default function Home() {
  return (
    <MainLayout>
      <main className="px-4 md:px-8 py-12">
        <section className="py-24 space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Professional Site Assessment
            <span className="block text-havelock-blue">by FGB Acumen</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Expert site assessment services with comprehensive reporting.
            Trust FGB Acumen for detailed insights and professional assessments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button className="w-full sm:w-auto bg-web-orange hover:bg-web-orange/90 text-white" size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
          <div className="rounded-lg border bg-card p-8 text-card-foreground hover:border-havelock-blue transition-colors">
            <div className="mb-4 text-havelock-blue">
              <ClipboardList className="h-12 w-12" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Easy Submission</h3>
            <p className="text-muted-foreground">
              Submit your site assessment requests quickly and easily through our intuitive interface.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-8 text-card-foreground hover:border-web-orange transition-colors">
            <div className="mb-4 text-web-orange">
              <BarChart3 className="h-12 w-12" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Detailed Reports</h3>
            <p className="text-muted-foreground">
              Receive comprehensive reports with detailed analysis and recommendations.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-8 text-card-foreground hover:border-conifer transition-colors">
            <div className="mb-4 text-conifer">
              <MapPin className="h-12 w-12" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor the status of your assessment requests in real-time.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 md:px-8">
        <div className="py-8 text-center text-sm text-muted-foreground">
          © 2024 FGB Acumen. All rights reserved.
        </div>
      </footer>
    </MainLayout>
  );
}