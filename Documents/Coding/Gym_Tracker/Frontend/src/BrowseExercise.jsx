import React from 'react'
import NavBar from './NavBar'
import { motion } from 'framer-motion';
import exerciseData from './exercises.json'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';



const BrowseExercise = () => {
    const location = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]);
  return (
    <div>
        <NavBar /> 

        <div className='flex flex-col items-center justify-center bg-gradient-to-t from-gray-700 via-gray-600 to-gray-400 bg-clip-text text-transparent font-extrabold text-4xl md:text-5xl pt-10'
          >
            <h2 className='flex justify-start items-start'>Choose a Muscle</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4 md:px-20 md:py-10">
            <Link to="/muscle/chest" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-full object-cover md:h-60"
                    src="https://i.pinimg.com/474x/a4/a2/2a/a4a22a7d2a08860592efafe577fbddcf.jpg"
                    alt="Chest Exercises"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-between p-4">
                    <p className="text-white text-sm md:text-4xl font-bold">Chest</p>
                    <div>
                        <i className="fi fi-rr-angle-double-small-right text-white text-sm md:text-4xl font-bold mt-20"></i>
                    </div>
                </div>
            </Link>

            <Link to="/muscle/back" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-full object-cover md:h-60"
                    src="https://i.imgur.com/SljJebL.jpeg"
                    alt="Back Exercises"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-between p-4">
                    <p className="text-white text-sm md:text-4xl font-bold">Back</p>
                    <div>
                        <i className="fi fi-rr-angle-double-small-right text-white text-sm md:text-4xl font-bold mt-20"></i>
                    </div>
                </div>
            </Link>

            <Link to="/muscle/shoulders" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-full object-cover md:h-60"
                    src="https://i.pinimg.com/474x/d6/b8/d5/d6b8d58d541d297c59fe308b562e325f.jpg"
                    alt="Shoulder Exercises"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-between p-4">
                    <p className="text-white text-sm md:text-4xl font-bold">Shoulders</p>
                    <div>
                        <i className="fi fi-rr-angle-double-small-right text-white text-sm md:text-4xl font-bold mt-20"></i>
                    </div>
                </div>
            </Link>

            <Link to="/muscle/arms" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-full object-cover md:h-60"
                    src="https://i.pinimg.com/474x/25/0d/73/250d73553191f19cce6ee0d303754d81.jpg"
                    alt="Arm Exercises"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-between p-4">
                    <p className="text-white text-sm md:text-4xl font-bold">Arms</p>
                    <div>
                        <i className="fi fi-rr-angle-double-small-right text-white text-sm md:text-4xl font-bold mt-20"></i>
                    </div>
                </div>
            </Link>

            <Link to="/muscle/core" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-full object-cover md:h-60"
                    src="https://i.pinimg.com/474x/25/5a/3f/255a3faf3356e121af41c26fdc6bb4a4.jpg"
                    alt="Core Exercises"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-between p-4">
                    <p className="text-white text-sm md:text-4xl font-bold">Core</p>
                    <div>
                        <i className="fi fi-rr-angle-double-small-right text-white text-sm md:text-4xl font-bold mt-20"></i>
                    </div>
                </div>
            </Link>

            <Link to="/muscle/legs" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-full object-cover md:h-60"
                    src="https://i.imgur.com/Hq78WpX.jpeg"
                    alt="Leg Exercises"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-between p-4">
                    <p className="text-white text-sm md:text-4xl font-bold">Legs</p>
                    <div>
                        <i className="fi fi-rr-angle-double-small-right text-white text-sm md:text-4xl font-bold mt-20"></i>
                    </div>
                </div>
            </Link>
        </div>




    </div>
  )
}

export default BrowseExercise