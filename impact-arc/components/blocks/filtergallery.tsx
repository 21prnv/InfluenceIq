"use client";

import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Heart,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

export interface FilterGalleryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  category?: string;
  engagement?: {
    score: string;
    dailyTrend: string;
    percentage: string;
    views?: string;
    likes?: string;
    comments?: string;
  };
}

export interface FilterGalleryProps {
  title?: string;
  description?: string;
  items: FilterGalleryItem[];
}

// Array of engagement metrics with their icons and colors
const engagementMetrics = [
  { key: "score", label: "Score", icon: BarChart3, color: "text-blue-400" },
  {
    key: "dailyTrend",
    label: "Trend",
    icon: TrendingUp,
    color: "text-green-400",
  },
  {
    key: "percentage",
    label: "Engagement",
    icon: Users,
    color: "text-purple-400",
  },
  { key: "views", label: "Views", icon: Eye, color: "text-yellow-400" },
  { key: "likes", label: "Likes", icon: Heart, color: "text-red-400" },
];

const FilterGallery = ({
  title = "Content Creators",
  description = "Discover amazing content creators across different categories and fields. Find your next favorite creator!",
  items = [],
}: FilterGalleryProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    if (!carouselApi) return;
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

  // Function to determine trend icon
  const getTrendIcon = (trend: string) => {
    if (trend.includes("+") || trend.includes("up")) {
      return (
        <TrendingUp className="inline-block mr-1 h-4 w-4 text-green-400" />
      );
    } else if (trend.includes("-") || trend.includes("down")) {
      return (
        <TrendingDown className="inline-block mr-1 h-4 w-4 text-red-400" />
      );
    }
    return <TrendingUp className="inline-block mr-1 h-4 w-4 text-blue-400" />;
  };

  return (
    <section className="">
      <div className="container mx-auto">
        <div className="mb-8 sm:-mt-24 flex items-end justify-end md:mb-10">
          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto text-white hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto text-white hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300"
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
              "(max-width: 768px)": { dragFree: true },
            },
          }}
        >
          <CarouselContent className="ml-0">
            {items.map((item, index) => (
              <CarouselItem
                key={item.id}
                className="max-w-[280px] pl-[20px] md:max-w-[300px] lg:max-w-[330px]"
              >
                <a
                  href={item.href}
                  className="group block"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    className={`relative overflow-hidden rounded-xl aspect-[4/5] border border-zinc-700 
                    transition-all duration-300
                    ${
                      hoveredItem === item.id
                        ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                        : "group-hover:border-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    }`}
                  >
                    {/* Profile Image */}
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      layout="fill"
                      className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 
                      ${
                        hoveredItem === item.id
                          ? "scale-110"
                          : "group-hover:scale-105"
                      }`}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

                    {/* Ranking Number */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 
                      ${hoveredItem === item.id ? "opacity-30" : "opacity-80"}`}
                    >
                      <span className="text-[120px] md:text-[150px] font-black text-white transform -translate-y-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                        {index + 1}
                      </span>
                    </div>

                    {/* Creator Name */}
                    <div className="absolute bottom-0 w-full p-4 text-center">
                      <h3 className="text-xl font-semibold text-white truncate">
                        {item.title.split(":")[0]}
                      </h3>
                    </div>

                    {/* Enhanced Engagement Metrics on Hover */}
                    {item.engagement && (
                      <div
                        className={`absolute inset-0 flex flex-col items-center justify-center bg-black/80 
                        transition-all duration-500 backdrop-blur-sm
                        ${
                          hoveredItem === item.id
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <div className="w-full max-w-[85%] space-y-3 p-4 rounded-lg bg-zinc-900/80 border border-zinc-700 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                          <h4 className="text-white font-bold text-center mb-2 border-b border-zinc-700 pb-2">
                            Engagement Metrics
                          </h4>
                          <div className="space-y-2">
                            {engagementMetrics.map((metric) => {
                              const value =
                                item.engagement?.[
                                  metric.key as keyof typeof item.engagement
                                ];
                              if (!value) return null;

                              return (
                                <div
                                  key={metric.key}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center">
                                    <metric.icon
                                      className={`h-4 w-4 mr-2 ${metric.color}`}
                                    />
                                    <span className="text-zinc-300 text-sm">
                                      {metric.label == null
                                        ? "N/A"
                                        : metric.label}
                                      :
                                    </span>
                                  </div>
                                  <span
                                    className={`font-medium text-sm ${metric.color}`}
                                  >
                                    {metric.key === "dailyTrend" ? (
                                      <span className="flex items-center">
                                        {getTrendIcon(value.toString())}
                                        {value == "null" ? "N/A" : value}
                                      </span>
                                    ) : value == "null" ? (
                                      "N/A"
                                    ) : (
                                      value
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="absolute bottom-4 w-full flex justify-center">
                          <span className="text-xs text-blue-300 animate-pulse">
                            Click to view profile
                          </span>
                        </div>
                      </div>
                    )}
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
                  currentSlide === index
                    ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)]"
                    : "bg-zinc-700 hover:bg-zinc-500"
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
