
import { forms } from '@/lib/data';
import FormPageClient from '@/components/forms/form-page-client';

export const dynamicParams = false;

export async function generateStaticParams() {
  return forms.map((form) => ({
    formId: form.id,
  }));
}

export default async function FormPage({ params }: { params: Promise<{ formId: string }> }) {
  const resolvedParams = await params;
  return <FormPageClient formId={resolvedParams.formId} />;
}
