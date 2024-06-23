import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import clsx from "clsx";
import Navbar from "@/components/navbar/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Footer from "@/components/footer/footer";

const inter = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const font = localFont({
  src: [
    {
      path: "../public/font/f1_regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font/f1_bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "F1® Foresight 24",
  description: "Can you predict the future?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={clsx(
            "min-h-screen flex flex-col items-center bg-f1-black text-white",
            font.className,
            inter.variable
          )}
        >
          <Navbar />
          <div className="flex flex-grow flex-col w-full max-w-[1280px] px-6 pb-16 pt-24 md:px-8">
            {children}
          </div>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: "bg-f1-black-lighter border-0",
                content: "text-white",
                icon: "text-white",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
