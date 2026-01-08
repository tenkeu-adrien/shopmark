"use client";
import { useEffect } from "react";
import NProgress from "nprogress";
import { usePathname } from "next/navigation";
import "nprogress/nprogress.css";

export default function ProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return null;
}
