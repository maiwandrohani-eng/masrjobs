import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { DashboardShell } from "@/components/DashboardShell";
import { authOptions } from "@/lib/auth-options";
import { isDemoAuthEnabled } from "@/lib/demo-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isDemoAuthEnabled() && process.env.NEXTAUTH_SECRET) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      redirect("/login?callbackUrl=%2Fdashboard");
    }
  }

  return <DashboardShell>{children}</DashboardShell>;
}
