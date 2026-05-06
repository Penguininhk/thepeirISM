
import { use } from 'react';
import { forms } from '@/lib/data';
import FormResponsesClient from '@/components/forms/form-responses-client';

export const dynamicParams = false;

export async function generateStaticParams() {
  return forms.map((form) => ({
    formId: form.id,
  }));
}

export default function FormResponsesPage({ params }: { params: Promise<{ formId: string }> }) {
  const resolvedParams = use(params);
  return <FormResponsesClient formId={resolvedParams.formId} />;
}
