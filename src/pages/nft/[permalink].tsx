import React from 'react';
import {
  ConnectWallet,
  useActiveClaimCondition,
  useAddress,
  useClaimedNFTs,
  useContract,
  useUnclaimedNFTs,
} from '@thirdweb-dev/react';
import { sanityClient, urlFor } from '../../../sanityClient';
import { Collection } from '../../../typings';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

interface Props {
  collection: Collection;
}

export default function NFTDropPage({ collection }: Props) {
  const address = useAddress();
  // console.log('Address:', address);
  const contract = useContract(collection.smartContractAddress, 'nft-drop').contract;
  const activeClaimCondition = useActiveClaimCondition(contract).data;
  // console.log('ActiveClaimCondition', activeClaimCondition);
  const claimedNFTs = useClaimedNFTs(contract).data;
  // console.log('Claimed', claimedNFTs);
  const unclaimedNFTs = useUnclaimedNFTs(contract).data;
  // console.log('Unclaimed', unclaimedNFTs);

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* LEFT */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-[#385783] to-[#EF8432] p-2">
            <img
              src={urlFor(collection.previewImage).url()}
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              alt=""
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">{collection.title}</h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        <header className="flex items-center justify-between h-20">
          <Link href="/">
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              The <span className="font-extrabold underline decoration-pink-600/50">ORIOR</span> NFT
              Marketplace
            </h1>
          </Link>
          <ConnectWallet
            btnTitle="Connect Wallet"
            theme="dark"
            className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
            dropdownPosition={{
              side: 'bottom', // "top" | "bottom" | "left" | "right";
              align: 'end', // "start" | "center" | "end";
            }}
          ></ConnectWallet>
        </header>
        <hr className="my-4 border" />
        {address && (
          <p className="text-center text-sm text-green-500">
            You are logged in with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            src={urlFor(collection.mainImage).url()}
            alt=""
            className="w-80 object-cover pb-10 lg:h-50"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            The {collection.nftCollectionName} NFT Drop
          </h1>
          {claimedNFTs && unclaimedNFTs ? (
            <p className="pt-2 text-xl text-green-500">
              {claimedNFTs.length}/{unclaimedNFTs.length} NFTs claimed
            </p>
          ) : (
            <div className="relative">
              <p className="pt-2 text-xl text-green-500 animate-pulse">Loading supply...</p>
              <img
                src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
                alt=""
                className="h-40 w-40 object-contain absolute -bottom-40"
              />
            </div>
          )}
        </div>
        <button
          disabled={
            !claimedNFTs ||
            !unclaimedNFTs ||
            !activeClaimCondition ||
            !address ||
            claimedNFTs.length === unclaimedNFTs.length
          }
          className="mt-10 h-16 w-full rounded-full bg-red-600 text-white font-bold disabled:bg-gray-400"
        >
          {!claimedNFTs || !unclaimedNFTs || !activeClaimCondition ? (
            <>Loading</>
          ) : !address ? (
            <>Sign in to mint</>
          ) : claimedNFTs.length === unclaimedNFTs.length ? (
            <>Sold out</>
          ) : (
            <span className="font-bold">
              Mint NFT ({activeClaimCondition.currencyMetadata.displayValue}{' '}
              {activeClaimCondition.currencyMetadata.symbol})
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }: GetServerSidePropsContext) {
  const query = `*[_type == "collection" && slug.current == $permalink][0]{
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

  const collection = await sanityClient.fetch(query, {
    permalink: params?.permalink,
  });

  if (!collection || !collection._id) {
    return {
      notFound: true,
    };
  }

  return { props: { collection } };
}
