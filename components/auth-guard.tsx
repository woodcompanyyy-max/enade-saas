"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (!auth && pathname !== "/login") {
      router.push("/login");
    } else {
      setIsAuth(true);
    }
  }, [pathname, router]);

  if (!isAuth && pathname !== "/login") return null;

  return <>{children}</>;
}
