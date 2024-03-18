/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { api } from '@/utils/api';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const session = pageProps.session;

  return (
    <div className={`font-sans ${inter.variable}`}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
