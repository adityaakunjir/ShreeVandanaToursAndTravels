import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, base).href,
    })),
  };
  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <span key={item.path} className="breadcrumb-item">
            {index > 0 && <ChevronRight size={13} aria-hidden="true" />}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.path}>{item.name}</Link>
            )}
          </span>
        ))}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, '\\u003c'),
        }}
      />
    </>
  );
}
