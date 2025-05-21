import { ComponentProps } from "react";
import { Link } from "react-router-dom";

type PageContainerProps = ComponentProps<"main"> & {
  isHome?: boolean;
};

export const PageContainer = ({
  children,
  isHome = false,
}: PageContainerProps) => {
  return (
    <div className="h-full min-h-dvh bg-neutral-50 text-neutral-800">
      <header className="flex flex-col items-center gap-x-8 gap-y-2 bg-neutral-700 px-4 py-4 text-white sm:flex-row sm:px-8">
        <h1 className="text-2xl font-semibold">Week Of Charity Utilities</h1>
        {!isHome && (
          <nav>
            <Link to="/" className="text-xl underline hover:decoration-2">
              Back to Overview
            </Link>
          </nav>
        )}
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
};
