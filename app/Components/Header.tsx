"use client";
import Image from 'next/image';
import { FC } from 'react';
import { useRouter } from 'next/navigation'; // <-- added

const Header: FC = () => {
  const router = useRouter(); // <-- added

  const handleLogin = () => {
    // Redirect to /Login page
    router.push('/Login');
  };

  const handleRequestDemo = () => {
    console.log('Request Demo button clicked');
  };

  return (
    <header className="bg-white sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-sm">
      {/* Left side: Logo and Heading with added padding */}
      <div className="flex items-center space-x-3 pl-4 md:pl-6">
        <Image
          src="/bussiness.png"
          alt="Martory Logo"
          width={70}
          height={50}
          className="object-contain"
          priority
        />
        <h1 className="text-gray-900 text-2xl font-bold tracking-tight">Martory</h1>
      </div>

      {/* Middle: Navigation Links and Buttons */}
      <div className="hidden md:flex items-center space-x-8">
        <nav className="flex items-center space-x-8">
          <a 
            href="#why-martory" 
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Why Martory?
          </a>
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
            onClick={handleLogin} // <-- will now navigate to /Login
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
    </header>
  );
};

export default Header;
