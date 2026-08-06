import { ActivityCompletionView } from "@/components/activity/ActivityCompletionView";

interface PageProps {
  params: Promise<{ activityRunId: string }>;
}

export default async function ActivityCompletePage({ params }: PageProps) {
  const { activityRunId } = await params;
  return <ActivityCompletionView activityRunId={activityRunId} />;
}
