"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin login page
    router.push("/admin/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#05010D] flex items-center justify-center">
      <div className="text-white">Redirecting to admin login...</div>
    </div>
  );
}
