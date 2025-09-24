"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthCheck() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();
          if (session?.user) {
            router.push("/admin/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, [router]);

  return { isChecking };
}
