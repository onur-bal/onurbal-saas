"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) router.replace("/dashboard");
      else router.replace("/login");
    })();
  }, [router]);

  return <p>Yönlendiriliyor...</p>;
}
