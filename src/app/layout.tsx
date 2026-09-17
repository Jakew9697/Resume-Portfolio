import type { Metadata } from 'next';
import { Geist, Geist_Mono, Fraunces, Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const editorial = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400'], variable: '--font-editorial' });
export const metadata: Metadata = {
  metadataBase: new URL('https://jakeworsham.syncgr.com'), title: { default: 'Jake Worsham — Working software', template: '%s · Jake Worsham' },
  description: 'Explore working demonstrations of Jake Worsham’s software: a sales workspace, voice assistant, document automation, RFP builder, and content studio.',
  icons: { icon: '/favicon.svg' },
  openGraph: { title: 'Jake Worsham — Working software', description: 'Open a project. Try the workflow. See how it works.', type: 'website' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${geist.variable} ${mono.variable} ${fraunces.variable} ${inter.variable} ${editorial.variable}`}>{children}</body></html>; }
