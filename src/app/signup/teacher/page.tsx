'use client';

import { Suspense } from 'react';

function FacultySignupContent() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center bg-card p-8 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-primary">Faculty Registration</h1>
        <p className="text-muted-foreground mt-2">Please contact the IT department to set up your faculty account.</p>
      </div>
    </div>
  );
}

export default function TeacherSignupPage() {
  return (
    <Suspense fallback={null}>
      <FacultySignupContent />
    </Suspense>
  );
}
