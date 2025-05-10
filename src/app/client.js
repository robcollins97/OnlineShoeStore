'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ClientLayout({ children }) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsReady(true);
  }, [pathname, router]);

  if (!isReady) {
    return <p>Loading...</p>; // Or a more appropriate loading UI
  }

  return <SessionProvider>{children}</SessionProvider>;
}

export default ClientLayout;