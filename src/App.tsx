import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

export const App = () => {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <Outlet />
    </QueryClientProvider>
  );
};
