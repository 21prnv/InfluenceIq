const features = [
  {
    icon: "⭐",
    title: "Credibility & Trustworthiness",
    description: "Advanced AI algorithms measure and verify authentic influence in specific domains",
  },
  {
    icon: "⏳",
    title: "Fame Longevity",
    description: "Track and analyze sustained relevance over time, not just viral moments",
  },
  {
    icon: "📈",
    title: "Meaningful Engagement",
    description: "Measure real impact and positive influence beyond surface-level metrics",
  },
  {
    icon: "🔒",
    title: "Anti-Manipulation",
    description: "Advanced systems to detect and prevent fake reviews and artificial inflation",
  },
]

export function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Redefining Digital Influence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive rating system goes beyond followers and likes to measure what truly matters
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 