import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="wrap not-found">
      <p className="eyebrow">A LITTLE DETOUR</p>
      <h1>
        This page took
        <br />
        <em>another journey.</em>
      </h1>
      <p>Let’s get you back to planning your next adventure.</p>
      <Link href="/" className="button">
        Back to home
      </Link>
    </main>
  );
}
