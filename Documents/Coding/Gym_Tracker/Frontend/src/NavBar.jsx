import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NavBar = () => {
  return (
    <div className='bg-white w-[100%] h-16 flex items-center justify-between shadow-xl'>
        <Link to="/home" className="flex items-center gap-4 mb-6 px-4 pt-4 ">
            <img 
              className="w-10 h-10 " 
              src="https://pbs.twimg.com/media/Gbg0yNhaQAAGV47?format=png&name=small" 
              alt="FitTrack Logo" 
            />
            <h1 className="font-bold text-4xl">FitTrack</h1>
        </Link>
        <div className='flex flex-row items-center justify-center '>
          <div className="px-4 hidden sm:flex space-x-4">
            
              <Link to="/home" className="text-xl font-xl text-black hover:text-gray-400 hover:scale-105 transition-colors p-2">Home</Link>
              <Link to="/muscle" className="text-xl font-xl text-black hover:text-gray-400 hover:scale-105 transition-colors p-2">Exercises</Link>
              <Link to="/plans" className="text-xl font-xl text-black hover:text-gray-400 hover:scale-105 transition-colors p-2">Plans</Link>
          </div>
          <Link to="/profile"
                  className="relative px-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
              >
                  <motion.img
                      className="h-10 w-10 rounded-full border border-gray-500 " 
                      src="https://i.imgur.com/XZwx7QS.jpeg"
                      alt="Profile"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                  />
          </Link>
        </div>
    </div>
  )
}

export default NavBar
