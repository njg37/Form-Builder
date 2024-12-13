// src/app/page.tsx
import Link from 'next/link';


export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Custom Form Builder</h1>
      <Link href="/form-builder">
        <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Open Form Builder
        </button>
      </Link>
    </div>
  );
}
