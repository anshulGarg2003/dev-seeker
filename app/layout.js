import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import { Providers } from "./Provider";
import Header from "@/components/Header";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Dev-Seeker",
  description: "A platform that connects developers to solve problems together",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader />
        <Providers>
          <Toaster />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
