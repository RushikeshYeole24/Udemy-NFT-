/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import BaseLayout from '../components/ui/layout/BaseLayout'
import { NftList } from '../components/ui'

import { useListedNfts } from '@hooks/web3'

const Home: NextPage = () => {
  const { nfts } = useListedNfts()

  console.log(nfts.data)

  // Array of images for the slider
  const images = [
    '/images/default_avatar.png',
    '/images/default_user_image.png',
    '/images/Creature_2.png'
  ]

  // Slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Function to move to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 3000) // 3000ms = 3 seconds
    return () => clearInterval(interval) // Clean up on component unmount
  }, [])

  return (
    <BaseLayout>
      <div className="relative bg-gradient-to-r from-gray-50 via-blue-50 to-gray-100 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative z-10">
          {/* Full-Width Box */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md w-full flex justify-center items-center relative">
            {/* Image Slider */}
            <div className="mr-8">
              <div className="w-80 h-80 bg-gray-200 overflow-hidden relative">
                <img
                  src={images[currentImageIndex]}
                  alt={`Slide ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  key={currentImageIndex}
                />
              </div>
            </div>

            {/* Text block */}
            <div className="text-center flex-grow">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                InScribe
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 sm:mt-6">
                A marketplace for unique literary NFTs—where creativity and blockchain merge!
              </p>
            </div>

            {/* Search Bar */}
            {/* <div className="absolute bottom-4 right-4">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div> */}
          </div>

          <div className="mt-12">
            <NftList />
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default Home
