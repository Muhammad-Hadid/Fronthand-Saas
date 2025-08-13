"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FC, useRef } from "react";

const features = [
  {
    title: "Effortless Store Management",
    description:
      "Create and manage your store profile with ease, keeping all your business details organized in one powerful dashboard.",
    image: "/Effortless Store Management.png",
  },
  {
    title: "Complete Product Control",
    description:
      "Add, edit, and monitor your products in real time — from pricing to stock levels — to ensure a smooth shopping experience for customers.",
    image: "/Product Control.png",
  },
  {
    title: "Secure Transactions & Swift Approvals",
    description:
      "Accept payments through encrypted systems and enjoy fast approval processes to start selling without delays.",
    image: "/Secure Transactions.png",
  },
  {
    title: "Real-Time Order & Inventory Tracking",
    description:
      "Stay on top of every order and keep your inventory accurate to prevent missed sales or overselling.",
    image: "/real time order.png",
  },
  {
    title: "Advanced Role-Based Permissions",
    description:
      "Control who can access and manage specific parts of your store, keeping your operations secure and efficient.",
    image: "/role base permission.png",
  },
  {
    title: "Comprehensive Reports & Analytics",
    description:
      "Access detailed insights into sales, customer trends, and store performance to make informed, data-driven decisions.",
    image: "/report and analysis.png",
  },
];

const MartoryFeatures: FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Why Choose <span className="text-blue-600">Martory</span>?
        </h2>
        <p className="text-lg text-gray-600">
          Manage your store, products, and sales with ease — all in one powerful
          platform designed for efficiency and growth.
        </p>
      </motion.div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100"
            whileHover={{ 
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
          >
            <motion.div 
              className="flex justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-blue-50 p-4 rounded-full">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default MartoryFeatures;