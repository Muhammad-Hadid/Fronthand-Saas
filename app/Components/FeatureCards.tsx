"use client";

import { useState } from "react";

export default function FeatureSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      title: "Integration Hub",
      description: "Seamless API connections",
      color: "from-emerald-400 to-teal-600",
      shadowColor: "shadow-emerald-500/25",
      hoverShadow: "hover:shadow-emerald-500/40",
      image: "/1.jpg",
      icon: "🔗",
    },
    {
      id: 2,
      title: "Cloud Infrastructure",
      description: "Scalable SaaS platform",
      color: "from-rose-400 to-pink-600",
      shadowColor: "shadow-rose-500/25",
      hoverShadow: "hover:shadow-rose-500/40",
      image: "/2.jpg",
      icon: "☁️",
    },
    {
      id: 3,
      title: "Smart Analytics",
      description: "Real-time insights",
      color: "from-cyan-400 to-blue-600",
      shadowColor: "shadow-cyan-500/25",
      hoverShadow: "hover:shadow-cyan-500/40",
      image: "/3.jpg",
      icon: "📊",
    },
  ];

  return (
    <section className="p-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* Left Side Content */}
        <div className="space-y-12">
          {/* Integration Section */}
          <div className="group">
            <div className="mb-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Integration
              </h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Axacute seamlessly connects with best-of-breed accounting and ERP systems through 
              powerful REST APIs and flexible data file imports, creating a unified ecosystem.
            </p>
            <button className="group relative bg-[#3261B3] hover:bg-[#274a85] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg">
              <span className="relative z-10">LEARN MORE</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Cloud-based Section */}
          <div className="group">
            <div className="mb-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Cloud-based (SaaS)
              </h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Built for the modern enterprise with configurable workflows that adapt to your unique needs. 
              Our cloud-first architecture ensures reliability, security, and effortless scaling.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Minimize IT infrastructure costs while maximizing flexibility. Scale instantly without 
              hardware constraints, delays, or complexity.
            </p>
            <button className="group relative bg-[#3261B3] hover:bg-[#274a85] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg">
              <span className="relative z-10">SIGN UP NOW</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Right Side - Overlapping cards */}
        <div className="relative h-[500px] w-full">

          {/* Card 1 */}
          <div 
            className="absolute top-0 left-0 transform -rotate-6 cursor-pointer"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ zIndex: hoveredCard === 1 ? 40 : 30 }}
          >
            <div className={`
              w-56 h-64 rounded-2xl overflow-hidden transition-all duration-500 transform
              ${hoveredCard === 1 ? 'scale-110 rotate-0' : 'hover:scale-105 hover:-rotate-3'}
              bg-white ${features[0].shadowColor} shadow-2xl ${features[0].hoverShadow} hover:shadow-3xl
              border border-white/50 backdrop-blur-sm
              translate-y-16
            `}>
              <div className="relative h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${features[0].image})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${features[0].color} opacity-90`}></div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="text-3xl mb-3">{features[0].icon}</div>
                    <h3 className="text-lg font-semibold mb-3">{features[0].title}</h3>
                    <p className="text-lg text-white/90 leading-relaxed">{features[0].description}</p>
                  </div>
                </div>
                {hoveredCard === 1 && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl"></div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className="absolute top-16 right-4 transform rotate-3 cursor-pointer"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ zIndex: hoveredCard === 2 ? 40 : 20 }}
          >
            <div className={`
              w-56 h-64 rounded-2xl overflow-hidden transition-all duration-500 transform
              ${hoveredCard === 2 ? 'scale-110 rotate-0' : 'hover:scale-105 hover:rotate-1'}
              bg-white ${features[1].shadowColor} shadow-2xl ${features[1].hoverShadow} hover:shadow-3xl
              border border-white/50 backdrop-blur-sm
              translate-y-16
            `}>
              <div className="relative h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${features[1].image})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${features[1].color} opacity-90`}></div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="text-3xl mb-3">{features[1].icon}</div>
                    <h3 className="text-lg font-semibold mb-3">{features[1].title}</h3>
                    <p className="text-lg text-white/90 leading-relaxed">{features[1].description}</p>
                  </div>
                </div>
                {hoveredCard === 2 && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl"></div>
                )}
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rotate-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ zIndex: hoveredCard === 3 ? 40 : 10 }}
          >
            <div className={`
              w-56 h-64 rounded-2xl overflow-hidden transition-all duration-500 transform
              ${hoveredCard === 3 ? 'scale-110 rotate-0' : 'hover:scale-105 hover:-rotate-1'}
              bg-white ${features[2].shadowColor} shadow-2xl ${features[2].hoverShadow} hover:shadow-3xl
              border border-white/50 backdrop-blur-sm
            `}>
              <div className="relative h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${features[2].image})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${features[2].color} opacity-90`}></div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="text-3xl mb-3">{features[2].icon}</div>
                    <h3 className="text-lg font-semibold mb-3">{features[2].title}</h3>
                    <p className="text-lg text-white/90 leading-relaxed">{features[2].description}</p>
                  </div>
                </div>
                {hoveredCard === 3 && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl"></div>
                )}
              </div>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-ping delay-500"></div>
        </div>
      </div>
    </section>
  );
}
