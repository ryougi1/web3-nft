import React from 'react';
import { Web3Button, ConnectWallet, useAddress } from '@thirdweb-dev/react';

function NFTDropPage() {
  const address = useAddress();
  console.log('Address:', address);

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* LEFT */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-[#385783] to-[#EF8432] p-2">
            <img
              // src="https://www.instagram.com/p/CqX7OLNslmy/media?size=l"
              src="https://i5.walmartimages.com/asr/bc76c0b0-ab1e-4636-9335-42de23722660.b53ce9d56602c72762bc5c687d179865.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff"
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              alt=""
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              ORIOR CollectionName
            </h1>
            <h2 className="text-xl text-gray-300">
              STUDENT ART GALLERY #33 - Hilda Kronberg
            </h2>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            The{' '}
            <span className="font-extrabold underline decoration-pink-600/50">
              ORIOR
            </span>{' '}
            NFT Marketplace
          </h1>
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
        <hr className="my-2 border" />
        {/* CONTENT */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            src="https://www.ecotextile.com/images/stories/2020/April/asics_edo1.jpg"
            alt=""
            className="w-80 object-cover pb-10 lg:h-50"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            The COLLECTIONNAME NFT Drop
          </h1>
          <p className="pt-2 text-xl text-green-500">x/y NFTs claimed</p>
        </div>
        {/* MINT */}
        <button className="mt-10 h-16 w-full rounded-full bg-red-600 text-white font-bold">
          Mint NFT (X.XX ETH)
        </button>
      </div>
    </div>
  );
}

export default NFTDropPage;
