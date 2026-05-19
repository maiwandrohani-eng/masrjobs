import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Providers } from "@/components/Providers";
import { getContactPublicData } from "@/lib/site-contact";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MasrJobs.org — Egypt’s Development & Social Impact Jobs Platform",
  description:
    "MasrJobs.org connects Egypt’s NGO, development, humanitarian, and social impact ecosystem with jobs, consultancies, trainings, volunteering, tenders, and grants.",
};

/** Footer social links and contact sidebar read SiteSetting on each request (not build-time cache). */
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contact = await getContactPublicData();

  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject body attributes after SSR */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter social={contact.social} />
        </Providers>
      </body>
    </html>
  );
}
