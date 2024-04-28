import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ToggleContextProvider from "./components/toggleprovider";
import SidebarContextProvider from "./components/sidebarprovider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RamsayGPT",
  description: "A Gordon Ramsay themed chatbot",
};

export default function RootLayout({ children, }: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <ToggleContextProvider>
          <SidebarContextProvider>
            <div id="app">
              {children}
            </div>
          </SidebarContextProvider>
        </ToggleContextProvider>
      </body>
    </html>
  );
}
