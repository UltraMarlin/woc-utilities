import { ComponentProps } from "react";

export const PageContainer = ({ children }: ComponentProps<"main">) => {
  return (
    <main className="h-full min-h-dvh bg-neutral-50 p-4 text-neutral-800 sm:p-8">
      {children}
    </main>
  );
};
