
// IMPORTANT: Load environment variables from .env.local before any other imports.
import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { initializeServerFirebase } from '@/firebase/server-config';
import { UserProfile } from '@/lib/data';

// Helper function to handle errors
function handleError(error: any, action: string) {
  console.error(`Error during ${action}:`, error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  const { firestore } = initializeServerFirebase();

  try {
    switch (action) {
      case 'list-users': {
        const usersCol = firestore.collection('users');
        const userSnapshot = await usersCol.get();
        if (userSnapshot.empty) {
          return NextResponse.json([]);
        }
        const userList = userSnapshot.docs.map(doc => ({ ...(doc.data() as UserProfile), id: doc.id }));
        return NextResponse.json(userList);
      }

      case 'list-action-logs': {
        const logsCol = firestore.collection('actionLogs');
        const logsQuery = logsCol.orderBy('timestamp', 'desc').limit(10);
        const logsSnapshot = await logsQuery.get();
        if (logsSnapshot.empty) {
          return NextResponse.json([]);
        }
        const logsList = logsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            timestamp: data.timestamp.toDate().toISOString(), // Serialize timestamp
          };
        });
        return NextResponse.json(logsList);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return handleError(error, `GET ${action}`);
  }
}

export async function POST(request: NextRequest) {
  const { auth, firestore } = initializeServerFirebase();
  const body = await request.json();
  const { action, payload } = body;

  try {
    switch (action) {
      case 'update-user-status': {
        const { userId, status, email, role } = payload;
        const userRef = firestore.collection('users').doc(userId);
        await userRef.update({ status: status });

        if (status === 'approved' && role === 'admin') {
          await auth.setCustomUserClaims(userId, { isAdmin: true });
        }

        const logDetails = `User '${email}' status updated to '${status}'.`;
        await firestore.collection('actionLogs').add({
          timestamp: new Date(),
          adminId: 'admin', // Replace with actual admin UID in a real app
          actionType: 'user_status_update',
          details: logDetails,
        });

        console.log(`--- (Simulated Email) To: ${email}, Subject: Account Status Updated, Body: Your account status is now ${status}. ---`);
        return NextResponse.json({ success: true, message: 'User status updated successfully.' });
      }

      case 'create-user': {
        const { email, password, firstName, lastName, role } = payload;

        const userRecord = await auth.createUser({
          email,
          password,
          displayName: `${firstName} ${lastName}`,
        });

        const newUserProfile: UserProfile = {
          id: userRecord.uid,
          firstName,
          lastName,
          email,
          role,
          status: 'approved',
          classIds: [],
        };
        await firestore.collection('users').doc(userRecord.uid).set(newUserProfile);
        
        const logDetails = `New user '${email}' created with role '${role}'.`;
        await firestore.collection('actionLogs').add({
            timestamp: new Date(),
            adminId: 'admin', // Replace with actual admin UID
            actionType: 'user_created',
            details: logDetails,
        });

        return NextResponse.json(newUserProfile);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return handleError(error, `POST ${action}`);
  }
}
