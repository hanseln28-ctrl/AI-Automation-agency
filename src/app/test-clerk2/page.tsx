'use client';

import React, { useEffect, useState } from 'react';

export default function TestClerk2Page() {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import('@clerk/nextjs')
      .then(async (clerk) => {
        try {
          // Try rendering just ClerkProvider with nothing inside
          const { ClerkProvider } = clerk;
          setComponent(() => () =>
            React.createElement(
              ClerkProvider,
              {
                publishableKey: 'pk_test_dml0YWwtbWFuLTMuY2xlcmsuYWNjb3VudHMuZGV2',
              },
              React.createElement('div', null, 'ClerkProvider mounted')
            )
          );
        } catch (e: any) {
          setError('Render setup error: ' + (e.message || String(e)));
        }
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

  if (!Component) {
    return (
      <div style={{ padding: 40, color: 'white', background: '#111' }}>
        Loading ClerkProvider...
      </div>
    );
  }

  return <Component />;
}
