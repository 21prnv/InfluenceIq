import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import exercisesData from '../exercises.json';
import NavBar from '../NavBar';

const Card = ({ index, title, muscle, gif_url, onSelect }) => {
  return (
    <motion.div
      layoutId={`exercise-${index}`}
      className="group bg-white shadow-xl rounded-lg p-6 cursor-pointer flex flex-row justify-start gap-10 h-36 relative"
      onClick={onSelect}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center xl:h-20">
        <img src={gif_url} alt={title} className="w-auto h-20 object-cover" />
      </div>
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-xl lg:text-2xl font-extrabold">{title}</h2>
        <h3 className="text-lg font-light">{muscle}</h3>
      </div>
    </motion.div>
  );
};


const FullScreenCard = ({ exercise, onClose }) => {
  return (
    <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 px-4 py-10 md:py-32"
        initial={{ opacity: 0, y: 500 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 500 }}
        transition={{
          duration: 0.6, // Adjust the duration for smoother entry/exit
          ease: [0.25, 0.8, 0.5, 1], // Smooth cubic-bezier easing
        }}
      >

      <div className="bg-white w-full max-w-5xl mx-auto h-[90vh] sm:h-auto rounded-3xl shadow-2xl  overflow-auto flex flex-col items-end p-4">

        <motion.button
          onClick={onClose}
          className="bg-black text-white px-4 py-2 rounded-full w-auto  md:w-auto flex items-end fixed"
        >
          X
        </motion.button>
        <div className='flex flex-col lg:flex-row items-center gap-10 p-5 md:p-10'>
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={exercise.gif_url}
              className="max-w-full max-h-[50vh] object-contain rounded-2xl"
              alt="Exercise GIF"
            />
          </div>
        
          <motion.div className="w-full lg:w-1/2">
            <div className="flex items-center gap-4 mb-6">
              <img
                src="https://pbs.twimg.com/media/Gbg0yNhaQAAGV47?format=png&name=small"
                className="w-10 h-10"
                alt=""
              />
              <motion.h2 className="text-3xl md:text-5xl font-bold">{exercise.name}</motion.h2>
            </div>
            
            <motion.h3 className="text-lg md:text-xl mb-4">
              <span className="font-medium">Target Muscle:</span> {exercise.muscle}
            </motion.h3>
            <hr className="border-black mb-6" />
            
          
            <motion.h3 className="text-xl md:text-2xl font-semibold mb-4">Preparation</motion.h3>
            <motion.p className="text-gray-700 text-start py-2">1. {exercise.description1}</motion.p>
            <motion.p className="text-gray-700 text-start py-2">2. {exercise.description2}</motion.p>
            
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const MuscleExercises = () => {
  const { muscle } = useParams();
  const [exercises, setExercises] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (exercisesData.exercises && exercisesData.exercises[muscle]) {
      setExercises(exercisesData.exercises[muscle]);
    }
  }, [muscle]);

  const selectedExercise = selectedIndex !== null ? exercises[selectedIndex] : null;

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center bg-gradient-to-t pt-6 from-gray-700 via-gray-600 to-gray-400 bg-clip-text text-transparent font-extrabold text-5xl lg:text-7xl sm:text-6xl">
        <h2 className="capitalize">{muscle}</h2>
      </div>
      <div className="container mx-auto p-10 py-10 sm:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <Card
                key={index}
                index={index}
                title={exercise.name}
                muscle={exercise.muscle}
                gif_url={exercise.gif_url}
                description={`${exercise.description1} ${exercise.description2 || ''}`}
                onSelect={() => setSelectedIndex(index)}
              />
            ))
          ) : (
            <p className="text-center text-gray-600">No exercises found for this muscle group.</p>
          )}
        </div>
      </div>
      <AnimatePresence>
        {selectedExercise && (
          <FullScreenCard
            exercise={selectedExercise}
            index={selectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MuscleExercises;
