import { ActivityRunner } from "@/components/activity/ActivityRunner";

interface PageProps {
  params: Promise<{ activityRunId: string }>;
}

export default async function ActivityRunPage({ params }: PageProps) {
  const { activityRunId } = await params;
  return <ActivityRunner activityRunId={activityRunId} />;
}
