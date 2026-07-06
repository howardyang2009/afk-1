import type { ReactNode } from 'react';

export const metadata = {
  title: 'AI Component Search',
  description: 'Search AI marketplaces for skills, agents, prompts, and MCP servers',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>{children}</body>
    </html>
  );
}
