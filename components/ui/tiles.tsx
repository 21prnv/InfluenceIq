"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TilesProps {
  className?: string
  rows?: number
  cols?: number
  tileClassName?: string
  tileSize?: "sm" | "md" | "lg"
  animated?: boolean
}

const tileSizes = {
  sm: "w-8 h-8",
  md: "w-9 h-9 md:w-12 md:h-12",
  lg: "w-12 h-12 md:w-16 md:h-16",
}

export function Tiles({
  className,
  rows = 100,
  cols = 10,
  tileClassName,
  tileSize = "md",
  animated = true,
}: TilesProps) {
  const rowsArray = new Array(rows).fill(1)
  const colsArray = new Array(cols).fill(1)
  
  // State to track mouse position for interactive effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Update mouse position
  useEffect(() => {
    if (!animated) return
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [animated])

  return (
    <div 
      className={cn(
        "relative z-0 flex w-full h-full justify-center",
        className
      )}
    >
      {rowsArray.map((_, i) => (
        <motion.div
          key={`row-${i}`}
          className={cn(
            tileSizes[tileSize],
            "border-l dark:border-neutral-700 border-neutral-200 relative",
            tileClassName
          )}
        >
          {colsArray.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `var(--tile)`,
                transition: { duration: 0 }
              }}
              animate={animated ? {
                boxShadow: "0 0 0 rgba(139, 92, 246, 0)",
                transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
              } : {}}
              key={`col-${j}`}
              className={cn(
                tileSizes[tileSize],
                "border-r border-t dark:border-neutral-700 border-neutral-200 relative",
                tileClassName
              )}
            />
          ))}
        </motion.div>
      ))}
    </div>
  )
}