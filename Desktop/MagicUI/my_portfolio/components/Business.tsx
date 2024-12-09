"use client"
import React from 'react'
import { FeaturesSectionDemo } from './Freelancing'

const Business = () => {
  return (
    <div 
    id='freelancing'
    className=' lg:m-h-screen py-20 md:py-4  h-full flex flex-col items-center justify-center xl:px-32'>
        <h2
          className="text-4xl px-10 sm:py-16 lg:text-7xl font-bold  text-center bg-gradient-to-r from-[#f1f5f966] via-[#f1f5f9] via-51% to-[#f1f5f966] text-transparent bg-clip-text"
        >
          Freelancing <span className="text-blue-500">Services</span>
        </h2>
      <FeaturesSectionDemo/>
    </div>
  )
}

export default Business
