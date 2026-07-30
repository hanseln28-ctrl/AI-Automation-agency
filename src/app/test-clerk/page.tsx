'use client';

import { useEffect, useState } from 'react';

export default function TestClerkPage() {
  const [result, setResult] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test 1: Can we dynamically import Clerk?
    import('@clerk/nextjs')
      .then((clerk) => {
        setResult('Clerk module loaded OK. Available exports: ' + Object.keys(clerk).join(', '));
      })
      .catch((e) => {
        setError('Module load error: ' + (e.message || String(e)));
      });
  }, []);

  if (error) {
    return (
      <div style={{ padding: 40, color: 'red', fontFamily: 'monospace' }}>
        <h1>Error</h1>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, color: 'white', background: '#111', fontFamily: 'monospace', minHeight: '100vh' }}>
      <h1>Clerk Diagnostic</h1>
      <p>{result}</p>
    </div>
  );
}
