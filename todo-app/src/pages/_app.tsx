import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { api } from '@/utils/api';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className={`font-sans ${inter.variable}`}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
