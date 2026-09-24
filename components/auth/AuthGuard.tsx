"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.replace("/login");
        return;
      }

      setIsAuthenticated(true);
      setCheckingAuth(false);
    };

    const timer = window.setTimeout(checkAuthentication, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Checking authentication...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}