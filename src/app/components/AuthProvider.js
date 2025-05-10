'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react'; // React needs to be imported for JSX

function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvider;