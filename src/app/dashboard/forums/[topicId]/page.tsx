
import { forums } from '@/lib/data';
import ForumTopicClient from '@/components/forums/forum-topic-client';

export const dynamicParams = false;

export async function generateStaticParams() {
  return forums.map((forum) => ({
    topicId: forum.id,
  }));
}

export default async function ForumTopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const resolvedParams = await params;
  return <ForumTopicClient topicId={resolvedParams.topicId} />;
}
