import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./component/navbar";
import { CookiesProvider } from "next-client-cookies/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supreme Shoes",
  description: "Buy your supreme shoes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html style={{width:"100%", }} lang="fr">
      <body style={{width:"100%",  color:"black"}}>
        <div className="flex flex-col w-12/12 justify-between">

          <header className="w-12/12 h-16 sm:h-20">
            <Navbar/>
          </header>

          <CookiesProvider>{children}</CookiesProvider>

          <footer className="w-12/12 bg-black h-40">
          
          </footer>
        </div>
      </body>
    </html>
  );
}
