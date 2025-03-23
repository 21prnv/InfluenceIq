"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { Tiles } from "../ui/tiles";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supbase/client";
import { LoadingStates } from "@/app/analysis/component/loading-states";

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  darkLineColor = "gray",
}) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--dark-line": darkLineColor,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent to-90%" />
    </div>
  );
};

const AnimatedTile = ({
  delay = 0,
  size = 10,
  x,
  y,
}: {
  delay: number;
  size: number;
  x: number;
  y: number;
}) => {
  return (
    <motion.div
      className="absolute z-[2] bg-purple-500/5 border border-purple-500/10 rounded-sm"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.7, 0],
        scale: [0, 1, 0.8],
        y: [0, -20, -40],
        x: [0, 10, 0],
      }}
      transition={{
        duration: 4,
        delay: delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  );
};

const RandomTiles = () => {
  const tiles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: Math.random() * 10,
    size: Math.floor(Math.random() * 30) + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
      {tiles.map((tile) => (
        <AnimatedTile
          key={tile.id}
          delay={tile.delay}
          size={tile.size}
          x={tile.x}
          y={tile.y}
        />
      ))}
    </div>
  );
};

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: {
    regular: string;
    gradient: string;
  };
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  bottomImage?: {
    dark: string;
  };
  gridOptions?: {
    angle?: number;
    cellSize?: number;
    opacity?: number;
    darkLineColor?: string;
  };
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title = "Welcome To ImpactArc",
      subtitle = {
        regular: "The AI-Powered System That Ranks",
        gradient: " Who Really Matters .",
      },
      description = "Enter an Instagram username below to analyze their profile and get detailed insights powered by AI.",
      ctaText = "Analyze Profile",
      ctaHref = "/analyzer",
      bottomImage = {
        dark: "/dashboard.png",
      },
      gridOptions,
      ...props
    },
    ref
  ) => {
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [currentStep, setCurrentStep] = useState<
      "scraping" | "analyzing" | "generating"
    >("scraping");
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!username.trim()) {
        setError("Please enter an Instagram username");
        return;
      }

      setIsLoading(true);
      setError("");
      setCurrentStep("scraping");
      setMessage("Analyzing profile... This may take up to 2 minutes.");

      try {
        // Step 1: Check if username already exists in Supabase
        const { data: existingData, error: checkError } = await supabase
          .from("user_data")
          .select("insta_username")
          .eq("insta_username", username)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          // throw new Error("Error checking username: " + checkError.message);
        }

        if (existingData) {
          setMessage(`Profile for ${username} already exists. Redirecting...`);
          setTimeout(() => router.push(`/analysis/${username}`), 1000);
          return;
        }

        // Step 2: Call the Instagram scraping API
        const scrapeResponse = await fetch("https://server-production-a40c.up.railway.app/api/scrape-instagram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        if (!scrapeResponse.ok) {
          const errorText = await scrapeResponse.text();
          throw new Error(
            `Scraping failed: ${scrapeResponse.status} - ${errorText}`
          );
        }

        const scrapedData = await scrapeResponse.json();
        setCurrentStep("analyzing");

        // Step 3: Call the existing /api/analyze endpoint for Gemini response
        const analyzeResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: scrapedData }),
        });

        if (!analyzeResponse.ok) {
          const errorText = await analyzeResponse.text();
          throw new Error(
            `Analysis failed: ${analyzeResponse.status} - ${errorText}`
          );
        }

        setCurrentStep("generating");
        const geminiResponse = await analyzeResponse.json();

        // Step 4: Insert data into Supabase
        const { error: insertError } = await supabase.from("user_data").insert({
          insta_username: username,
          scrapped_data: scrapedData,
          reponse: geminiResponse,
        });

        if (insertError) {
          throw new Error(
            "Failed to save data to Supabase: " + insertError.message
          );
        }

        setMessage("Analysis complete! Redirecting...");
        setTimeout(() => router.push(`/analysis/${username}`), 1000);
      } catch (err: any) {
        console.error("Error in analysis process:", err);
        setError(`An error occurred: ${err.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div
        className={cn("relative overflow-hidden min-h-screen", className)}
        ref={ref}
        {...props}
      >
        <div className="absolute top-0 z-[1] h-screen w-screen bg-purple-900/20 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        <div className="absolute inset-0 z-0">
          <Tiles
            rows={30}
            cols={30}
            tileSize="md"
            tileClassName="hover:bg-purple-500/20 transition-colors duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-[1]" />
        </div>

        <div className="relative z-10">
          <section className="relative max-w-full mx-auto">
            <div className="max-w-screen-xl mx-auto px-4 py-28 gap-12 md:px-8">
              <div className="space-y-5 max-w-3xl leading-0 lg:leading-5 mx-auto text-center">
                {!isLoading && (
                  <>
                    <h1 className="text-sm text-gray-400 group font-geist mx-auto px-5 py-2 bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent border-[2px] border-white/5 rounded-3xl w-fit backdrop-blur-sm">
                      {title}
                      <ChevronRight className="inline w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
                    </h1>
                    <h2 className="text-4xl font-geist bg-clip-text text-transparent mx-auto md:text-6xl bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
                      {subtitle.regular}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-orange-200">
                        {subtitle.gradient}
                      </span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-300">
                      {description}
                    </p>
                  </>
                )}

                <form
                  onSubmit={handleSubmit}
                  className={cn(
                    "mt-8 space-y-4 max-w-md mx-auto",
                    isLoading && "mt-0"
                  )}
                >
                  {isLoading ? (
                    <div className="mt-0">
                      <LoadingStates
                        username={username}
                        currentStep={currentStep}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Enter Instagram username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                          disabled={isLoading}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full inline-flex justify-center items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
                      >
                        <span className="flex items-center">
                          {ctaText}
                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </button>

                      {error && (
                        <div className="text-red-500 text-sm mt-2">{error}</div>
                      )}
                      {message && !error && (
                        <div className="text-green-400 text-sm mt-2">
                          {message}
                        </div>
                      )}
                    </>
                  )}
                </form>
              </div>

              {bottomImage && !isLoading && (
                <div className="mt-32 mx-10 relative">
                  <img
                    src={bottomImage.dark}
                    className="w-full shadow-lg rounded-3xl border-1 border-gray-400 backdrop-blur-sm"
                    alt="Dashboard preview"
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }
);
HeroSection.displayName = "HeroSection";

export { HeroSection };
