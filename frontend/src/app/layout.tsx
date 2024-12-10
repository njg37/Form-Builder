import Link from 'next/link';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Form Management</Link>
            </li>
            <li>
              <Link href="/preview">Preview Forms</Link>
            </li>
          </ul>
        </nav>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
