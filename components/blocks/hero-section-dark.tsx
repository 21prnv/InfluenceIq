import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { StarBorder } from "../ui/star-border"
import { Tiles } from "../ui/tiles"
import { motion } from "framer-motion"

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: {
    regular: string
    gradient: string
  }
  description?: string
  ctaText?: string
  ctaHref?: string
  bottomImage?: {
    dark: string
  }
  gridOptions?: {
    angle?: number
    cellSize?: number
    opacity?: number
    darkLineColor?: string
  }
}

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
  } as React.CSSProperties

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`,
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent to-90%" />
    </div>
  )
}

// Add random animated tiles that hover over the background
const AnimatedTile = ({ delay = 0, size = 10, x, y }: { delay: number, size: number, x: number, y: number }) => {
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
        ease: "easeInOut"
      }}
    />
  )
}

// Create 10 random tiles
const RandomTiles = () => {
  // Create an array of random positions
  const tiles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: Math.random() * 10,
    size: Math.floor(Math.random() * 30) + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

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
  )
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
      description = "Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.",
      ctaText = "Get Started",
      ctaHref = "/analyzer",
      bottomImage = {
        dark: "https://farmui.vercel.app/dashboard.png",
      },
      gridOptions,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative overflow-hidden min-h-screen", className)} ref={ref} {...props}>
        {/* Background gradient */}
        <div className="absolute top-0 z-[1] h-screen w-screen bg-purple-900/20 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        {/* Tiles component as background */}
        <div className="absolute inset-0 z-0">
          <Tiles
            rows={30} 
            cols={30}
            tileSize="md"
            tileClassName="hover:bg-purple-500/20 transition-colors duration-500"
          />
          {/* Gradient overlay for better contrast with content */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-[1]" />
        </div>
        
        {/* Content with higher z-index to appear above the tiles */}
        <div className="relative z-10">
          <nav className="relative bg-transparent border-b border-gray-800/30">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link 
                  href="/" 
                  className="bg-clip-text bg-gradient-to-br from-white via-30% via-white to-white/30 font-bold text-2xl text-center leading-[1.2] md:leading-[1.3] text-transparent"
                >
                  ImpactArc
                </Link>
                
                <div className="flex items-center gap-6">
                  <Link 
                    href="/" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/analyzer" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Analyzer
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          
          <section className="relative max-w-full mx-auto">
            <div className="max-w-screen-xl mx-auto px-4 py-28 gap-12 md:px-8">
              <div className="space-y-5 max-w-3xl leading-0 lg:leading-5 mx-auto text-center">
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
                <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
                  <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full text-xs font-medium">
                    <a href={ctaHref}>
                      <StarBorder>
                        {ctaText}
                      </StarBorder>
                    </a>
                  </div>
                </div>
              </div>
              
              {bottomImage && (
                <div className="mt-32 mx-10 relative">
                  <img
                    src={bottomImage.dark}
                    className="w-full shadow-lg rounded-3xl border-1 border-gray-100 backdrop-blur-sm"
                    alt="Dashboard preview"
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    )
  },
)
HeroSection.displayName = "HeroSection"

export { HeroSection }