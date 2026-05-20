import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Setup font Poppins dengan ketebalan yang bervariasi
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "JIMARSIP - Sistem Arsip Digital",
  description: "Sistem Arsip Digital Desa Jimbaran Kulon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.className} bg-[#F5F7FB] text-[#1E293B]`}>
        {children}
      </body>
    </html>
  );
}