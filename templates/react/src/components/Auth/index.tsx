import React, { type ReactNode } from 'react';
import { useAuth } from './useAuth';

interface AuthProps {
  code: string | null | undefined;
  children: ReactNode;
}

const Auth: React.FC<AuthProps> = ({ code, children }) => {
   if (code === undefined || code === null) return <>{children}</>;
  const hasAuth = useAuth(code);
  if (!hasAuth) return null;
  return <>{children}</>;
};

export default Auth;