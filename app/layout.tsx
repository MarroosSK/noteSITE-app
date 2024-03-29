import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Provider from "@/components/provider";
import { db } from "@/lib/db";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClerkProvider, currentUser } from "@clerk/nextjs";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { Raleway } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const getData = async (id: string) => {
  noStore();
  if (id) {
    const data = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        colorSchema: true,
      },
    });
    return data;
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // taking logged in userId and sending via prisma to db compare if ID matches, if yes, data about user is  send back
  const user = await currentUser();
  const userData = await getData(user?.id as string);

  //console.log(userData);

  return (
    <ClerkProvider>
      <html lang="en">
        <Provider>
          <body
            className={`${inter.className} ${
              userData?.colorSchema ?? "theme-orange"
            } `}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <Toaster position="bottom-center" />
              <main>{children}</main>
              <Footer />
            </ThemeProvider>
          </body>
        </Provider>
      </html>
    </ClerkProvider>
  );
}
