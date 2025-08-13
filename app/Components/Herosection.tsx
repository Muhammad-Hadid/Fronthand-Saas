"use client";

import Image from "next/image";
import { FC } from "react";

const HeroSection: FC = () => {
    const handleContact = () => {
        console.log("Contact Us clicked");
        // Example: router.push('/contact');
    };

    return (
        <section className="bg-gradient-to-r from-[#4079B1] to-[#2b4db3] text-white px-6 py-16 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left Side Content */}
                <div className="space-y-6 pl-7">
                    <h2 className="text-4xl font-bold leading-snug">
                        Martory: SaaS Inventory and Production System
                    </h2>
                    <p className="text-lg text-blue-100 leading-relaxed">
                        Improve stock accuracy, enhance product traceability, and track sales performance
                        with a smarter and more efficient grocery inventory solution — all in one seamless
                        experience.
                    </p>
                    <button
                        onClick={handleContact}
                        className="bg-white text-[#1e4cd3] hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition duration-200"
                    >
                        Contact Us
                    </button>
                </div>


                {/* Right Side Image */}
                <div className="flex justify-center">
                    <Image
                        src="/home.png"
                        alt="Martory Home"
                        width={500}
                        height={400}
                        className="object-contain drop-shadow-lg"
                        priority
                    />
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
