"use client";
import Image from 'next/image';
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

const Header: FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    router.push('/Login');
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleRequestDemo = () => {
    console.log('Request Demo button clicked');
    setIsMobileMenuOpen(false); // Close mobile menu
  };

  const handleLogoClick = () => {
    router.push('/');
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleWhyMartoryClick = () => {
    router.push('/WhyMartory');
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side: Logo and Heading */}
        <div className="flex items-center space-x-3 pl-4 md:pl-6">
          <div onClick={handleLogoClick} className="cursor-pointer">
            <Image
              src="/bussiness.png"
              alt="Martory Logo"
              width={70}
              height={50}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-gray-900 text-2xl font-bold tracking-tight">Martory</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8">
            <div 
              onClick={handleWhyMartoryClick}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer"
            >
              Why Martory?
            </div>
            <a 
              href="#plans" 
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Plans
            </a>
            <a 
              href="#contact" 
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4 ml-8">
            <button
              onClick={handleLogin}
              className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Login
            </button>
            <button
              onClick={handleRequestDemo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Request a Demo
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            <nav className="space-y-4">
              <div 
                onClick={handleWhyMartoryClick}
                className="block text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer py-2"
              >
                Why Martory?
              </div>
              <a 
                href="#plans" 
                className="block text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Plans
              </a>
              <a 
                href="#contact" 
                className="block text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
            </nav>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogin}
                className="w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Login
              </button>
              <button
                onClick={handleRequestDemo}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Request a Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;