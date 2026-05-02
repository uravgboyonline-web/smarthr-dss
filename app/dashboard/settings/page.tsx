import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAuditLogs } from "@/app/actions/audit";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const auditLogs = await getAuditLogs();

  return (
    <SettingsClient 
      user={session?.user} 
      auditLogs={auditLogs} 
    />
  );
}
