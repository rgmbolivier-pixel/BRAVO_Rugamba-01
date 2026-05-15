import type { Metadata } from "next";
import "./globals.css";
import AppContent from "@/components/AppContent";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { UserProvider } from "@/contexts/UserContext";
import { ShiftProvider } from "@/contexts/ShiftContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { AlertNotificationProvider } from "@/contexts/AlertNotificationContext";

export const metadata: Metadata = {
  title: "TestOS · TestAI",
  description: "Test Market ?m?liyyat Sistemi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <ShiftProvider>
            <TaskProvider>
              <StoreProvider>
                <UserProvider>
                  <AlertNotificationProvider>
                    <AppContent>{children}</AppContent>
                  </AlertNotificationProvider>
                </UserProvider>
              </StoreProvider>
            </TaskProvider>
          </ShiftProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
