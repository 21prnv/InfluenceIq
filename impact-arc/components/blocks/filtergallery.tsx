"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface FilterGalleryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  category?: string;
}

export interface FilterGalleryProps {
  title?: string;
  description?: string;
  items: FilterGalleryItem[];
}

const FilterGallery = ({
  title = "Content Creators",
  description = "Discover amazing content creators across different categories and fields. Find your next favorite creator!",
  items = [],
}: FilterGalleryProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="">
      <div className="container mx-auto">
        <div className="mb-8 -mt-24 flex items-end justify-end md:mb-10">
          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto text-white"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto text-white"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full px-4 md:px-8 lg:px-24">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0">
            {items.map((item, index) => (
              <CarouselItem
                key={item.id}
                className="max-w-[280px] pl-[20px] md:max-w-[300px] lg:max-w-[330px]"
              >
                <a href={item.href} className="group block">
                  <div className="relative overflow-hidden rounded-xl aspect-[4/5] border border-zinc-700 group-hover:border-zinc-500 transition-all duration-300">
                    {/* Creator Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
                    
                    {/* Ranking Number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[120px] md:text-[150px] font-black text-white opacity-80 transform -translate-y-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                        {index + 1}
                      </span>
                    </div>
                    
                    {/* Creator Name */}
                    <div className="absolute bottom-0 w-full p-4 text-center">
                      <h3 className="text-xl font-semibold text-white truncate">{item.title.split(':')[0]}</h3>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {items.length > 0 && (
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentSlide === index ? "bg-white" : "bg-zinc-700"
                }`}
                onClick={() => carouselApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export { FilterGallery }; 