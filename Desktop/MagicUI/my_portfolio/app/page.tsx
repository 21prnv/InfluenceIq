"use client"
import Hero from "@/components/Hero";
import '../app/globals.css';
import Skills from "@/components/Tech_Stack";
import Business from "@/components/Business";
import { FloatingDockDemo } from "@/components/magicui/Dock";
import Plans from "@/components/Plans";
import Contact from "@/components/Contact";
import { WorldMapDemo } from "@/components/magicui/World_Map";

export default function Home() {
  return (
    <main className="bg-black text-white flex flex-col ">
      <Hero />
      <Business/>
      <Skills/>
      <div className="relative z-50 ">
        <FloatingDockDemo />
      </div>
      <Plans/>
      <WorldMapDemo/>
      <Contact />
    </main>
  );
}
