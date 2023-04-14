import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThirdwebProvider } from '@thirdweb-dev/react';

// const activeChain = 'ethereum';
const activeChain = 'sepolia';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={activeChain}>
      <Component {...pageProps} />;
    </ThirdwebProvider>
  );
}
