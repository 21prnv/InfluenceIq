import Filter from "@/components/blocks/filter";

export default function FilterPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Creator Gallery
        </h1>
        <p className="text-xl text-zinc-400 mb-12 max-w-3xl">
          Browse our curated collection of content creators across various categories. Filter by your interests to find your next favorite creator!
        </p>
      </div>
      <Filter />
    </main>
  );
} 