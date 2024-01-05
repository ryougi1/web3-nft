import { Inter } from 'next/font/google';
import Head from 'next/head';
import { sanityClient, urlFor } from '../../sanityClient';
import { Collection } from '../../typings';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

interface Props {
  collections: Collection[];
}

export default function Page({ collections }: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col py-20 px-10 2xl:px-0">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/public/favicon.ico" />
      </Head>

      <h1 className="text-4xl font-extralight mb-8">
        The{' '}
        <span className="font-extrabold underline decoration-pink-600/50">
          ORIOR
        </span>{' '}
        NFT Marketplace
      </h1>

      <main className="bg-slate-100 p-10 shadow-md">
        <div>
          {collections.map((collection) => (
            <Link key={collection._id} href={`/nft/${collection.slug.current}`}>
              <div className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105">
                <img
                  src={urlFor(collection.mainImage).url()}
                  alt=""
                  className="h-96 rounded-2xl object-cover"
                />
                <div className="p-5">
                  <h2 className="text-3xl">{collection.title}</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    {collection.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const query = `*[_type == "collection"]{
  _id,
  title,
  smartContractAddress,
  description,
  nftCollectionName,
  mainImage {
    asset  
  },
  previewImage {
    asset  
  },
  slug {
    current
  },
  creator->{
    _id,
    name,
    address,
    slug {
      current
    },
  },
}`;
  const collections = await sanityClient.fetch(query);
  // console.log('ssr home:', collections);
  return { props: { collections } };
}
