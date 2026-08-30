import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function TanstackProvider({ children }) {
  // Create the query client once
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 365 * 24 * 60 * 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
