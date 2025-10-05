'use server';

import { NextRequest, NextResponse } from 'next/server';
import { initializeServerFirebase } from '@/firebase/server-config';
import { Timestamp } from 'firebase-admin/firestore';

// Helper function to handle errors
function handleError(error: any, action: string) {
  console.error(`Error during ${action}:`, error);
  const message = error instanceof Error ? error.message : `An unknown error occurred during ${action}.`;
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const { firestore } = initializeServerFirebase();

    switch (action) {
      case 'list-users':
        const usersSnapshot = await firestore.collection('users').get();
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(usersList);

      case 'list-action-logs':
        const logsSnapshot = await firestore.collection('actionLogs').orderBy('timestamp', 'desc').limit(10).get();
        const logsList = logsSnapshot.docs.map(doc => {
          const data = doc.data();
          // Ensure timestamp is serialized correctly
          if (data.timestamp && data.timestamp instanceof Timestamp) {
            return {
              id: doc.id,
              ...data,
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


export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const { auth, firestore } = initializeServerFirebase();
    const body = await request.json();

    switch (action) {
      case 'create-user':
        const { email, password, firstName, lastName, role } = body;
        
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

        // Log the creation action
        await firestore.collection('actionLogs').add({
            details: `New user '${email}' created with role '${role}'.`,
            actionType: 'user_created',
            adminId: 'admin-system', // Or get from authenticated admin user
            timestamp: new Date(),
        });
        
        return NextResponse.json(newUserProfile);

      case 'update-user-status':
        const { userId, status, isAdmin } = body;
        
        const userRef = firestore.collection('users').doc(userId);
        await userRef.update({ status });
        
        // Only set the custom claim if isAdmin is explicitly true
        if (isAdmin) {
             await auth.setCustomUserClaims(userId, { admin: true });
        }

         // Log the status update action
        await firestore.collection('actionLogs').add({
            details: `User status for ${userId} updated to '${status}'.`,
            actionType: 'user_status_update',
            adminId: 'admin-system',
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
