"use client";

import React from "react";

export default function ContactForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3d82c8] to-[#61a7ec] p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-8 md:p-12">
        
        {/* Left Form */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-6">Contact us</h1>
          
          <form className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="First name*" className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#4079B1]" required />
              <input type="text" placeholder="Last name*" className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#4079B1]" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="email" placeholder="Email*" className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#4079B1]" required />
              <input type="tel" placeholder="Phone number*" className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#4079B1]" />
            </div>
            <input type="text" placeholder="Company name*" className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#4079B1]" required />
            
            <select className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#4079B1]">
              <option>I am interested in</option>
              <option>Product Inquiry</option>
              <option>Partnership</option>
              <option>Support</option>
            </select>

            {/* Checkbox */}
            <div className="flex items-start">
              <input type="checkbox" id="agree" className="mt-1" required />
              <label htmlFor="agree" className="ml-2 text-sm text-gray-600">
                I agree to receive communications from Martory.
              </label>
            </div>

            <button
              type="submit"
              className="bg-[#4079B1] text-white px-6 py-3 rounded-lg hover:bg-[#3260B2] transition w-full"
            >
              Submit
            </button>
          </form>
          
          {/* Simple centered copyright */}
          
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src="/5.webp"
              alt="Letter"
              className="max-w-[180px] w-full drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
