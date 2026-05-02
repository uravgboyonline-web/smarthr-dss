import { getEvaluationData } from "@/app/actions/evaluation";
import { EvaluationForm } from "./evaluation-form";

export const dynamic = "force-dynamic";

export default async function EvaluationsPage() {
  const { employees, indicators } = await getEvaluationData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Penilaian Kinerja & Perilaku</h1>
          <p className="text-sm text-muted-foreground mt-1">DSS Input Engine</p>
        </div>
      </div>
      <EvaluationForm 
        employees={employees} 
        indicators={indicators} 
      />
    </div>
  );
}
