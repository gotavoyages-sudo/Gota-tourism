"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const publicPaths = ["/login"];
    if (publicPaths.includes(pathname)) { setChecked(true); return; }
    fetch("/api/auth").then(r=>r.json()).then(j=>{
      if(!j.authenticated){
        router.replace("/login");
      } else {
        setAuthenticated(true);
      }
      setChecked(true);
    }).catch(()=>{ setChecked(true); });
  }, [pathname, router]);

  if (pathname === "/login") return <>{children}</>;
  if (!checked) return <div className="min-h-screen bg-[#f8f5ee] flex items-center justify-center"><div className="text-sm text-[#6b6b6b] animate-pulse">Checking staff access…</div></div>;
  if (!authenticated) return <div className="min-h-screen bg-[#f8f5ee] flex items-center justify-center"><div className="text-sm text-[#6b6b6b]">Redirecting to login…</div></div>;
  return <>{children}</>;
}
