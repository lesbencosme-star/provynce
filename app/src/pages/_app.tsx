import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WalletProvider } from '@/context/WalletContext';
import { FollowProvider } from '@/context/FollowContext';
import { ToastProvider } from '@/context/ToastContext';
import { MetricsProvider } from '@/context/MetricsContext';
import { UserProvider } from '@/context/UserContext';
import { CommunityProvider } from '@/context/CommunityContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <MetricsProvider>
        <UserProvider>
          <CommunityProvider>
            <WalletProvider>
              <FollowProvider>
                <Component {...pageProps} />
              </FollowProvider>
            </WalletProvider>
          </CommunityProvider>
        </UserProvider>
      </MetricsProvider>
    </ToastProvider>
  );
}
