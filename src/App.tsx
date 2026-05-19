import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SupportChat } from './components/SupportChat';
import { FAQRobot } from './components/FAQRobot';
import '@/src/i18n';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-bg-primary transition-colors duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Dashboard />
        </main>
        
        {/* Support Chat (Bottom Left) */}
        <SupportChat />
        
        {/* AI Robot (Bottom Right) */}
        <FAQRobot />
      </div>
    </ThemeProvider>
  );
}
