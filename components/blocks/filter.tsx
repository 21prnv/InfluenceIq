"use client";

import { useState, useEffect } from 'react';
import { FilterGallery, FilterGalleryItem } from './filtergallery';
import creators from '@/app/data/creators.json';
import { Button } from '@/components/ui/button';

// Define categories for filtering
const categories = [
  "All",
  "Fitness",
  "Health Care",
  "Travel and Lifestyle",
  "Food and Cooking",
  "Beauty and Fashion",
  "Gaming",
  "Education and Tutorials",
  "Technology and Gadgets",
  "Eco-Friendly Content",
];

const Filter = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState<FilterGalleryItem[]>([]);
  
  // Format creators data to match FilterGalleryItem interface
  const formatCreatorsData = (): FilterGalleryItem[] => {
    return creators.map(creator => ({
      id: creator.id,
      title: creator.name,
      description: creator.description,
      href: creator.href,
      image: creator.image
    }));
  };
  
  // Filter creators based on selected category
  useEffect(() => {
    const creatorItems = formatCreatorsData();
    
    if (activeCategory === "All") {
      setFilteredItems(creatorItems);
    } else {
      const filtered = creators
        .filter(creator => creator.category === activeCategory)
        .map(creator => ({
          id: creator.id,
          title: creator.name,
          description: creator.description,
          href: creator.href,
          image: creator.image
        }));
      
      setFilteredItems(filtered);
    }
  }, [activeCategory]);
  
  return (
    <div className="py-12 px-4 md:px-10">
      {/* Filter Buttons */}
      <div className="container px-4 md:px-12 lg:px-24 mb-10">
        <h2 className="text-3xl py-4 font-medium md:text-4xl lg:text-5xl text-white mb-6">
          Top Creator Rankings
        </h2>
        
        <p className="text-zinc-400 mb-8 max-w-3xl">
          Browse the rankings of the most influential content creators across various categories. 
          Numbers indicate their position in our rankings based on popularity and engagement.
        </p>
        
        <div className="flex flex-wrap gap-3 md:gap-4 mb-2">
          <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex space-x-4 md:flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full transition-all duration-300 px-5 py-2 text-sm font-medium shadow-sm ${
                    activeCategory === category 
                      ? "bg-gradient-to-r from-white to-gray-50 text-black hover:from-purple-600 hover:to-indigo-700 border-transparent transform scale-105" 
                      : "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Component */}
      {filteredItems.length > 0 ? (
        <FilterGallery
          title={`${activeCategory === "All" ? "Top Creators" : "Top " + activeCategory + " Creators"}`}
          items={filteredItems}
        />
      ) : (
        <div className="container mx-auto text-center py-20">
          <h3 className="text-2xl text-zinc-400">No creators found in this category.</h3>
          <Button 
            onClick={() => setActiveCategory("All")}
            variant="outline"
            className="mt-4 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
          >
            View All Creator Rankings
          </Button>
        </div>
      )}
    </div>
  );
};

export default Filter;
