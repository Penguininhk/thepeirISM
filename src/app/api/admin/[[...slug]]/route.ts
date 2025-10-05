
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { initializeServerFirebase } from '@/firebase/server-config';
import { Timestamp } from 'firebase-admin/firestore';
import type { ActionLog, UserProfile } from '@/lib/data';

// Helper function for consistent error handling
function handleError(error: any, action: string) {
  console.error(`Error during ${action}:`, error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  try {
    const { firestore } = initializeServerFirebase();

    switch (action) {
      case 'list-users':
        const usersSnapshot = await firestore.collection('users').get();
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProfile[];
        return NextResponse.json(usersList);

      case 'list-action-logs':
        const logsSnapshot = await firestore.collection('actionLogs').orderBy('timestamp', 'desc').limit(10).get();
        const logsList = logsSnapshot.docs.map(doc => {
          const data = doc.data() as ActionLog;
          if (data.timestamp && data.timestamp instanceof Timestamp) {
            return {
              ...data,
              id: doc.id,
              timestamp: data.timestamp.toDate().toISOString(),
            };
          }
          return { id: doc.id, ...data };
        });
        return NextResponse.json(logsList);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return handleError(error, `GET ${action}`);
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const { auth, firestore } = initializeServerFirebase();

    switch (action) {
      case 'create-user':
        const { email, password, firstName, lastName, role } = body;
        if (!email || !password || !firstName || !lastName || !role) {
            return NextResponse.json({ error: 'Missing required fields for user creation.' }, { status: 400 });
        }
        const userRecord = await auth.createUser({
          email,
          password,
          displayName: `${firstName} ${lastName}`,
        });

        const newUserProfile = {
          id: userRecord.uid,
          firstName,
          lastName,
          email,
          role,
          status: 'approved',
          classIds: [],
        };
        await firestore.collection('users').doc(userRecord.uid).set(newUserProfile);

        await firestore.collection('actionLogs').add({
          details: `New user '${email}' created with role '${role}'.`,
          actionType: 'user_created',
          adminId: 'admin-system', // Placeholder
          timestamp: new Date(),
        });
        
        return NextResponse.json(newUserProfile);

      case 'update-user-status':
        const { userId, status, isAdmin } = body;
        if (!userId || !status) {
            return NextResponse.json({ error: 'Missing required fields for status update.' }, { status: 400 });
        }
        
        await firestore.collection('users').doc(userId).update({ status });
        
        if (isAdmin) {
          await auth.setCustomUserClaims(userId, { admin: true });
        }

        await firestore.collection('actionLogs').add({
          details: `User status for ${userId} updated to '${status}'.`,
          actionType: 'user_status_update',
          adminId: 'admin-system', // Placeholder
          timestamp: new Date(),
        });

        return NextResponse.json({ success: true, userId, status });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return handleError(error, `POST ${action}`);
  }
}
