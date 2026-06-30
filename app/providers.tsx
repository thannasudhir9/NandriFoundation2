'use client';

import { AuthProvider } from '../src/AuthContext';
import { LanguageProvider } from '../src/LanguageContext';
import { ThemeProvider } from '../src/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
