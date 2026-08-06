import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import NextTopLoader from "nextjs-toploader";

const robotoHeading = Roboto({ subsets: ['latin'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Jetrique - Private Aviation Booking",
    template: "%s | Jetrique",
  },
  description: "Private jet and helicopter booking platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans", geistSans.variable, geistMono.variable, inter.variable, robotoHeading.variable)}
    >
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="#ffffff" showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
