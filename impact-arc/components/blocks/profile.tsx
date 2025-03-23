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

export interface ProfileGalleryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface ProfileGalleryProps {
  title?: string;
  description?: string;
  items: ProfileGalleryItem[];
}

const demoData: ProfileGalleryProps = {
  title: "Top Creators",
  description: "",
  items: [
    {
      "id": "carryminati",
      "title": "CarryMinati: The King of Indian Roasting",
      "description": "Explore how CarryMinati revolutionized content creation with his unique roasting and gaming videos, making him one of India's most popular YouTubers.",
      "href": "https://www.youtube.com/c/CarryMinati",
      "image": "https://i.pinimg.com/474x/09/cb/d1/09cbd173774cc2f3f9f7f7db869d0473.jpg"
    },
    {
      "id": "bbkivines",
      "title": "BB Ki Vines: Comedy That Connects",
      "description": "Discover how Bhuvan Bam's BB Ki Vines became a household name in India with his relatable, humorous storytelling and iconic characters.",
      "href": "https://www.youtube.com/c/BBKiVines",
      "image": "https://i.pinimg.com/474x/41/09/97/41099773023c2e18ce754477cb95b54a.jpg"
    },
    {
      "id": "technicalguruji",
      "title": "Technical Guruji: Simplifying Tech for India",
      "description": "Learn how Gaurav Chaudhary, aka Technical Guruji, became India's most trusted tech YouTuber by providing easy-to-understand tech reviews and insights.",
      "href": "https://www.youtube.com/c/TechnicalGuruji",
      "image": "https://i.pinimg.com/474x/76/b6/f4/76b6f4c8d64f40bacc2f4f2fc2804bcc.jpg"
    },
    {
      "id": "ashishchanchlani",
      "title": "Ashish Chanchlani: Comedy That Breaks the Internet",
      "description": "See how Ashish Chanchlani's hilarious sketches and relatable content have made him one of India's most beloved content creators.",
      "href": "https://www.youtube.com/c/ashishchanchlanivines",
      "image": "https://i.pinimg.com/474x/aa/ea/f4/aaeaf4f7f29478521c0c0bb91ac478f1.jpg"
    },
    {
      "id": "mrunalpanchal",
      "title": "Mrunal Panchal: The Queen of Beauty & Fashion",
      "description": "Explore how Mrunal Panchal built a massive following through her beauty, fashion, and lifestyle content, making her one of India's top influencers.",
      "href": "https://www.instagram.com/mrunu",
      "image": "https://i.pinimg.com/474x/67/9e/7c/679e7ca521426d18fed09115aa6faef3.jpg"
    }
  ]
};

const ProfileGallery = ({
  title = "Top Creators",
  description = "",
  items = [],
}: ProfileGalleryProps) => {
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
    <section className="py-16 px-4 md:px-8 lg:px-32">
      <div className="container mx-auto">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl text-white">
              {title}
            </h2>
            <p className="max-w-lg text-zinc-400">
              Browse our rankings of the most influential content creators.
              Numbers indicate their position based on popularity and engagement.
            </p>
          </div>
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
      <div className="w-full">
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

function ProfileGalleryDemo() {
  return <ProfileGallery {...demoData} />;
}

export { ProfileGalleryDemo };
