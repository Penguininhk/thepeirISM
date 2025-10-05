'use server';
// IMPORTANT: Load environment variables from .env.local before any other imports.
import 'dotenv/config';
import './flows/study-buddy-flow';

// Flows will be imported for their side effects in this file.
