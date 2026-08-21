import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Live Overlay',
  robots: { index: false, follow: false },
};

export default function OverlayAliasLayout({ children }: { children: ReactNode }) {
  return children;
}
