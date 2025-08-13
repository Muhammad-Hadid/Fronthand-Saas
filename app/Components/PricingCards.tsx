"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "FREE",
    price: 0,
    annual: "$0 billed monthly",
    monthly: "/month billed annually",
    popular: false,
    buttonColor: "bg-[#3261B1] text-white hover:bg-[#274a85]",
  },
  {
    name: "STANDARD",
    price: 29,
    annual: "$39 billed monthly",
    monthly: "/month billed annually",
    popular: false,
    buttonColor: "bg-[#3261B1] text-white hover:bg-[#274a85]",
  },
  {
    name: "PROFESSIONAL",
    price: 79,
    annual: "$99 billed monthly",
    monthly: "/month billed annually",
    popular: false,
    buttonColor: "bg-[#3261B1] text-white hover:bg-[#274a85]",
  },
  {
    name: "PREMIUM",
    price: 129,
    annual: "$159 billed monthly",
    monthly: "/month billed annually",
    popular: true,
    buttonColor: "bg-[#3261B1] text-white hover:bg-[#274a85]",
  },
  {
    name: "ENTERPRISE",
    price: 249,
    annual: "$299 billed monthly",
    monthly: "/month billed annually",
    popular: false,
    buttonColor: "bg-[#3261B1] text-white hover:bg-[#274a85]",
  },
];

export default function PricingCards() {
  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">Simple pricing. No surprises.</h2>
      </div>

      <div className="p-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`rounded-xl shadow-md p-8 h-[350px] flex flex-col justify-between text-center border transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? "border-[#3261B1] relative" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-3 bg-yellow-200 text-sm font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold mb-1">${plan.price}</p>
                <p className="text-gray-600">{plan.monthly}</p>
                <p className="text-gray-600 mb-6">{plan.annual}</p>
              </div>
              <button
                className={`w-full py-3 rounded-md font-medium border-2 border-[#3261B1] ${plan.buttonColor} transition`}
              >
                GET STARTED
              </button>
            </motion.div>
          ))}
        </div>

        {/* Added animated text below the cards */}
        <motion.p
          className="mt-10 text-center text-lg font-medium text-gray-700 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          Check out our{" "}
          <span className="text-[#3261B1]">Pricing page</span> for complete details ›
        </motion.p>
      </div>
    </section>
  );
}
