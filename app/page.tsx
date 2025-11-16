"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import Layout from "@/components/layout/Layout";
import StatsCards from "@/components/dashboard/StatsCards";
import DebitReductionChart from "@/components/dashboard/DebitReductionChart";
import StudentsChart from "@/components/dashboard/DebitComposition";
import StarStudentsTable from "@/components/dashboard/StarStudentsTable"; 
import { GraduationCap } from "lucide-react";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // Redirect to role-specific dashboard
    if (user.role === "teacher") {
      router.replace("/teacher/dashboard");
      return;
    } else if (user.role === "parent") {
      router.replace("/parent/dashboard");
      return;
    }
    // Admin stays on main dashboard
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-8 h-8 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">
            Good to see you, {user.name}
          </h1>

          <p className="text-gray-600">
            Your AI-powered dashboard is ready. Explore insights, review
            platform activity, and make informed decisions with Finomo.
          </p>
        </div>

        <StatsCards />

        <div className="flex flex-col lg:flex-row gap-6">
          <DebitReductionChart />
          <StudentsChart />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <StarStudentsTable /> 
        </div>
      </div>
    </Layout>
  );
}
