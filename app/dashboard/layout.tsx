import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background print:h-auto print:bg-white print:overflow-visible">
      <div className="hidden md:block print:hidden">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden print:overflow-visible">
        <div className="print:hidden">
          <Navbar />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 print:overflow-visible print:p-0 print:m-0">
          {children}
        </main>
      </div>
    </div>
  );
}
