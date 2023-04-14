import Image from 'next/image';
import { Inter } from 'next/font/google';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

const Home = () => {
  return (
    <div>
      <Head>
        <title>NFT Drop</title>
      </Head>
      <link rel="icon" href="/public/favicon.ico" />

      <h1>Hello NFT</h1>
    </div>
  );
};

export default Home;
