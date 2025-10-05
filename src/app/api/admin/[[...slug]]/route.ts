import 'dotenv/config'; // Load environment variables
import { initializeServerFirebase } from '@/firebase/server-config';
import type { UpdateUserStatusInput } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug?.[0];
  const { firestore } = initializeServerFirebase();

  try {
    switch (slug) {
      case 'list-users':
        const usersCol = firestore.collection('users');
        const userSnapshot = await usersCol.get();
        if (userSnapshot.empty) {
          return NextResponse.json([]);
        }
        const userList = userSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        return NextResponse.json(userList);

      case 'list-action-logs':
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
            timestamp: data.timestamp.toDate().toISOString(),
          };
        });
        return NextResponse.json(logsList);

      default:
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error in GET /api/admin/${slug}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug?.[0];
  const { auth, firestore } = initializeServerFirebase();

  try {
    switch (slug) {
      case 'update-user-status':
        const body: UpdateUserStatusInput = await request.json();
        const { userId, status, email, role } = body;

        // Step 1: Update the user's status in the Firestore document.
        const userRef = firestore.collection('users').doc(userId);
        await userRef.update({ status: status });

        // Step 2: If an 'admin' role is approved, set their custom claim.
        if (status === 'approved' && role === 'admin') {
          await auth.setCustomUserClaims(userId, { isAdmin: true });
          console.log(`Successfully set custom claim { isAdmin: true } for user ${userId}`);
        }

        // Step 3: Log the administrative action.
        const logDetails = `User '${email}' status updated to '${status}'.`;
        await firestore.collection('actionLogs').add({
          timestamp: new Date(),
          adminId: 'admin', // In a real app, this would be the UID of the logged-in admin.
          actionType: 'user_status_update',
          details: logDetails,
        });

        // Step 4: Simulate sending a notification email.
        console.log('--- Sending Email (Simulation) ---');
        console.log(`To: ${email}`);
        console.log(`Subject: Your Account Status has been updated`);
        console.log(`Body: Hello, your account status has been updated to: ${status}.`);
        console.log('------------------------------------');

        return NextResponse.json({ success: true, message: `User status updated and action logged successfully.` });

      default:
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error in POST /api/admin/${slug}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}
