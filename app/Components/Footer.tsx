import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Column 1 - Brand/Logo */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#3260B2]">Martory</h2>
          <p className="text-gray-500 text-sm">
            Empowering businesses with innovative solutions since 2025.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-[#3260B2] transition-colors">
              <FaLinkedin size={18} />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#3260B2] transition-colors">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#3260B2] transition-colors">
              <FaFacebook size={18} />
            </a>
          </div>
        </div>

        {/* Column 2 - Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Company</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-[#3260B2] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#3260B2] transition-colors">Partner Program</a></li>
            <li><a href="#" className="hover:text-[#3260B2] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#3260B2] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#3260B2] transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 3 - Getting Started */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Resources</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-[#3260B2] transition-colors">FAQs</a></li>
            <li><a href="#" className="hover:text-[#3260B2] transition-colors">Support</a></li>
            <li><a href="#" className="hover:text-[#3260B2] transition-colors">Developer Docs</a></li>
            <li><a href="#" className="hover:text-[#3260B2] transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-[#3260B2] transition-colors">Community</a></li>
          </ul>
        </div>

        {/* Column 4 - Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-[#3260B2] flex-shrink-0" />
              <span className="text-gray-600">
                Office #12, Business Plaza, I-8 Markaz, Islamabad, Pakistan
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-[#3260B2] flex-shrink-0" />
              <a href="mailto:hadeed.se@gmail.com" className="hover:text-[#3260B2] transition-colors">
                hadeed.se@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-[#3260B2] flex-shrink-0" />
              <a href="tel:+1234567890" className="hover:text-[#3260B2] transition-colors">
                +92 300 1234567
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-200 py-6 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Martory Ltd. All Rights Reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-[#3260B2] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#3260B2] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#3260B2] transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}