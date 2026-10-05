import type { AnchorHTMLAttributes } from 'react';
import { whatsappEnquiry } from '@/lib/whatsapp';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  destination?: string;
};

export default function WhatsAppLink({
  destination = '',
  children,
  ...props
}: Props) {
  return (
    <a
      {...props}
      href={whatsappEnquiry(destination)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
