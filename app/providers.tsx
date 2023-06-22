"use client";

import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import AuthProvider from "./auth/context/AuthContext";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
