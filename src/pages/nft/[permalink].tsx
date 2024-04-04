import React, { useEffect, useState } from 'react';
import { ConnectWallet, useAddress, useContract } from '@thirdweb-dev/react';
import { sanityClient, urlFor } from '../../../sanityClient';
import { Collection } from '../../../typings';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

interface Props {
  collection: Collection;
}

export default function NFTDropPage({ collection }: Props) {
  const address = useAddress();
  const contract = useContract(collection.smartContractAddress, 'nft-drop').contract;

  const [supply, setSupply] = useState<number[] | undefined>(undefined);
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>();
  const [mintedNFT, setMintedNFT] = useState<any | undefined>(undefined);
  const [activeClaimCondition, setActiveClaimCondition] = useState<any | undefined>(undefined);

  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (contract && address) {
        const res = await contract.getOwned(address);
        setOwnedNFTs(res);
      } else {
        setOwnedNFTs([]);
      }
    };
    const updateSupply = async () => {
      if (contract) {
        const claimedRes = await contract.getAllClaimed();
        const unClaimedRes = await contract.getAllUnclaimed();
        setSupply([claimedRes.length, unClaimedRes.length]);
      }
    };
    const fetchClaimCondition = async () => {
      if (contract) {
        const res = await contract.claimConditions.getActive();
        setActiveClaimCondition(res);
      }
    };
    fetchOwnedNFTs();
    updateSupply();
    fetchClaimCondition();
  }, [contract, address, mintedNFT]);

  const mintNFT = async () => {
    if (!address || !contract) return;
    contract
      .claimTo(address, 1)
      .then(async (tx) => {
        const receipt = tx[0].receipt;
        const nft = await tx[0].data();

        console.log('Receipt', receipt);
        console.log('NFT', nft);
        setMintedNFT({ ...receipt, ...nft });
      })
      .catch((err) => console.log('Transaction error', err));
  };

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10 relative">
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
          <p className="text-center text-sm font-bold text-gray-500">
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
          {supply ? (
            <p className="pt-2 text-xl text-green-500">
              {supply[0]}/{supply[1]} NFTs claimed
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
          {address && ownedNFTs && (
            <div>
              <span>You own {ownedNFTs.length} NFTs from this collection</span>
            </div>
          )}
        </div>

        <button
          onClick={mintNFT}
          disabled={!supply || !activeClaimCondition || !address || supply[0] === supply[1]}
          className="mt-10 h-16 w-full rounded-full bg-red-600 text-white font-bold disabled:bg-gray-400"
        >
          {!supply || !activeClaimCondition ? (
            <>Loading</>
          ) : !address ? (
            <>Login with wallet to mint</>
          ) : supply[0] === supply[1] ? (
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
