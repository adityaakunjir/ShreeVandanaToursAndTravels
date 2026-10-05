import { redirect } from 'next/navigation';
import { whatsappEnquiry } from '@/lib/whatsapp';

export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string | string[] }>;
}) {
  const params = await searchParams;
  redirect(
    whatsappEnquiry(
      typeof params.destination === 'string' ? params.destination : '',
    ),
  );
}
