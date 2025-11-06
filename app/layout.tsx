import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Scrybe",
  description: "Write your own blogs Now!",
};

export default function RootLayout({children}: {children: React.ReactNode;}) {
  return (
    <html lang="en">
      <head>
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Montaga&display=swap" rel="stylesheet" />

      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Toaster position="top-right" />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}