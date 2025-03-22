import { Waves } from "./waves-background"

export function CallToAction() {
  return (
    <section className="relative py-24 overflow-hidden">
      <Waves className="opacity-20" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Ready to Lead the Change?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join us in redefining fame—fairly, intelligently, and transparently. 
          Be part of the revolution that measures true influence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity">
            Join the Waitlist
          </button>
          <button className="px-8 py-3 rounded-full bg-white text-purple-600 font-semibold hover:bg-purple-50 transition-colors">
            Request Demo
          </button>
        </div>
      </div>
    </section>
  )
} 