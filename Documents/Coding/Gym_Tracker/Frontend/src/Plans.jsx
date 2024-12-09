import React,{useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar'
import { Link } from 'react-router-dom';

const Plans = () => {
    const location = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]);
  return (
    <div>
        <NavBar /> 

        <div className='flex flex-col items-center justify-center bg-gradient-to-t from-gray-700 via-gray-600 to-gray-400 bg-clip-text text-transparent font-extrabold text-4xl md:text-5xl pt-10'
          >
            <h2 className='flex justify-start items-start'>Choose a Plan</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 py-4 md:px-20 md:py-10">
            <Link to="/plans/classic" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-64 md:w-full object-cover md:h-60 filter grayscale"
                    src="https://i.pinimg.com/474x/e6/83/c8/e683c8e4c2f66c1a0c316c9f968b5b9c.jpg"
                    alt="Classic Body Part Split"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex flex-col items-start justify-end p-4">
                    <p className="text-white text-sm md:text-2xl font-bold">Classic Body Part Split</p>
                    <p className='text-gray-200'>5 Days per Week</p>
                </div>
            </Link>

            <Link to="/plans/ppl" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-64 md:w-full object-cover md:h-60 filter grayscale"
                    src="https://i.pinimg.com/564x/4f/5d/9d/4f5d9d1db0b1b6d1defa06661d59fc20.jpg"
                    alt="Back Exercises"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex flex-col items-start justify-end p-4">
                    <p className="text-white text-sm md:text-2xl font-bold">Push, Pull, Legs</p>
                    <p className='text-gray-200'>6 Days per Week</p>
                </div>
            </Link>

            <Link to="/plans/upper-lower" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-64 md:w-full object-cover md:h-60 filter grayscale"
                    src="https://i.pinimg.com/564x/fb/4d/44/fb4d44101721524f854ae8707d3cdb60.jpg"
                    alt="Shoulder Exercises"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex flex-col items-start justify-end p-4">
                    <p className="text-white text-sm md:text-2xl font-bold">Upper/Lower Split</p>
                    <p className='text-gray-200'>4 Days per Week</p>
                </div>
            </Link>

            <Link to="/plans/fullbody" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-64 md:w-full object-cover md:h-60 filter grayscale"
                    src="https://i.pinimg.com/474x/a9/01/52/a90152d783442bd43d95afcce95ae9f4.jpg"
                    alt="Arm Exercises"
                />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex flex-col items-start justify-end p-4">
                    <p className="text-white text-sm md:text-2xl font-bold">Full-Body Routine</p>
                    <p className='text-gray-200'>3 Days per Week</p>
                </div>
            </Link>

            <Link to="/plans/power" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-64 md:w-full object-cover md:h-60 filter grayscale"
                    src="https://i.pinimg.com/474x/75/4e/61/754e615ed39f954d0e7e45da834e77c5.jpg"
                    alt="Core Exercises"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex flex-col items-start justify-end p-4">
                    <p className="text-white text-sm md:text-2xl font-bold">Power & Hypertrophy Split</p>
                    <p className='text-gray-200'>5 Days per Week</p>
                </div>
            </Link>

            <Link to="/plans/endurance" className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-xs mx-auto transform transition duration-500 hover:scale-105 hover:shadow-3xl">
                <img
                    className="h-40 w-64 md:w-full object-cover md:h-60 filter grayscale"
                    src="https://i.pinimg.com/474x/25/0a/2a/250a2ac850730ae5820f48f508b2312b.jpg"
                    alt="Leg Exercises"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-100 transition-opacity duration-300 rounded-lg flex flex-col items-start justify-end p-4">
                    <p className="text-white text-sm md:text-2xl font-bold">Endurance & Functional Training</p>
                    <p className='text-gray-200'>4 Days per Week</p>
                </div>
            </Link>
        </div>




    </div>
  )
}

export default Plans