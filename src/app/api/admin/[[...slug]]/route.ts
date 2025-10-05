import { listActionLogs } from '@/ai/flows/list-action-logs-flow';
import { listUsers } from '@/ai/flows/list-users-flow';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug?.[0];

  try {
    switch (slug) {
      case 'list-users':
        const users = await listUsers();
        return NextResponse.json(users);

      case 'list-action-logs':
        const logs = await listActionLogs();
        return NextResponse.json(logs);

      default:
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error in /api/admin/${slug}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}
