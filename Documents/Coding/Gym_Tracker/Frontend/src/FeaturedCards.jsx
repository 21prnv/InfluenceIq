import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ title, description }) => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.3 }}
    className="xl:w-60 xl:h-40 sm:h-52  group bg-white shadow-lg rounded-lg p-6 transition-transform duration-300 transform hover:scale-105 
    bg-gradient-to-t from-white via-white to-white hover:from-gray-200 hover:via-white hover:to-white">
       <div className='flex gap-3'>
            <i className="fi fi-ss-gym text-indigo-600"></i>
            <h3 className="text-xl font-bold mb-2 group-hover:ml-4 transition-all duration-400">{title}</h3>
       </div> 
      <p className="text-gray-700">{description}</p>
    </motion.div>
  );
};

const FeatureCards = () => {
  const features = [
    {
      title: "Explore Exercises",
      description: "Find exercises for every skill level.",
    },
    {
      title: "Muscle Group Targeting",
      description: "Search exercises by muscle group.",
    },
    {
      title: "Exercise Splits",
      description: "Discover workout splits for your needs.",
    },
    {
      title: "Custom Workout Plans",
      description: "Create personalized plans for fitness.",
    },
    {
      title: "Pre-Made Workout Plans",
      description: "Use expert-designed plans",
    },
    {
      title: "Track Your Progress",
      description: "Log workouts and monitor your gains.",
    },
    {
      title: "Nutrition Guidance",
      description: "Get advice on diet to support your goals.",
    },
    {
      title: "Goal Setting",
      description: "Set and achieve personal fitness goals.",
    },
    {
      title: "Exercise GIF",
      description: "Access GIF tutorials for proper form.",
    },
  ];
  
  return (
    <div className="container mx-auto p-10 sm:px-32 py-10 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`${index >= features.length - 3 ? "hidden lg:block" : ""}`}
          >
            <Card title={feature.title} description={feature.description} />
          </div>
        ))}
      </div>
    </div>

  );
};

export default FeatureCards;
