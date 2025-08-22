"use client";
import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { ArrowRight, CheckCircle, BarChart3, Shield, Zap, Users, TrendingUp, Globe } from 'lucide-react';

export default function WhyMartory() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
<section className="bg-white text-white py-20 relative overflow-hidden shadow-lg m-10">
        <div className="absolute inset-0 bg-gradient-to-r from-white-100 via-white-100 to-white-100 animate-gradient-shift bg-[length:200%_200%]"></div>
        <style jsx>{`
          @keyframes gradient-shift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient-shift {
            animation: gradient-shift 8s ease infinite;
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-semibold mb-6 text-gray-900">
              Why Choose Martory?
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The intelligent inventory management solution that transforms how businesses handle their supply chain
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Key Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-[#3F78B1]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Tenant Architecture</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Each business gets its own subdomain (store-name.martory.com) with complete isolation and customization while benefiting from centralized infrastructure.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-[#3F78B1]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Analytics</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get instant insights into total stock value, category distribution, and low-stock alerts to make data-driven decisions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-[#3F78B1]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure Authentication</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enterprise-grade security with automated store association and role-based permissions to protect your business data.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#3F78B1]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Streamlined Operations</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Reduce complexity with our SaaS-based approach that eliminates the need for separate systems while providing tailored control.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-[#3F78B1]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Optimization</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Prevent overstocking and stockouts with intelligent alerts, reducing carrying costs and improving cash flow.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-[#3F78B1]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User-Friendly Design</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Intuitive interface designed for efficiency, making inventory management accessible to teams of all technical levels.
              </p>
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              The Martory Advantage
            </h2>
            
            <div className="prose prose-md max-w-none">
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                People choose Martory for its inventory system due to its ability to streamline operations with a tenant-specific, SaaS-based approach. The platform's use of subdomains (e.g., store-name.martory.com) allows businesses to manage their stock independently while benefiting from a centralized, scalable solution.
              </p>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                This flexibility appeals to companies seeking tailored control without the complexity of maintaining separate systems. Additionally, Martory's real-time analytics and stock tracking—such as total stock value, category distribution, and low-stock alerts—enable better decision-making, reducing costs from overstocking or stockouts.
              </p>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                The integration of secure authentication and automated store association further enhances trust and efficiency, making it a practical choice for businesses looking to optimize their supply chain with minimal overhead.
              </p>
              
              <p className="text-gray-700 text-sm leading-relaxed">
                This combination of customization, real-time insights, and user-friendly design positions Martory as a preferred solution for businesses aiming to enhance inventory efficiency and profitability.
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-white rounded-xl p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Key Features That Set Us Apart
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-[#3F78B1] mt-1 mr-3 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-900">Independent Store Management</h4>
                </div>
                <p className="text-gray-600 text-sm">Each store operates on its own subdomain with complete autonomy</p>
              </div>
                
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-[#3F78B1] mt-1 mr-3 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-900">Real-Time Stock Tracking</h4>
                </div>
                <p className="text-gray-600 text-sm">Monitor inventory levels and movements in real-time</p>
              </div>
                
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-[#3F78B1] mt-1 mr-3 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-900">Automated Alerts</h4>
                </div>
                <p className="text-gray-600 text-sm">Get notified about low stock, overstock, and other critical events</p>
              </div>
                
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-[#3F78B1] mt-1 mr-3 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-900">Advanced Analytics</h4>
                </div>
                <p className="text-gray-600 text-sm">Comprehensive reporting and insights for better decision-making</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-[#3F78B1] mt-1 mr-3 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-900">Role-Based Permissions</h4>
                </div>
                <p className="text-gray-600 text-sm">Secure access control with customizable user roles</p>
              </div>
                
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-[#3F78B1] mt-1 mr-3 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-900">Scalable Infrastructure</h4>
                </div>
                <p className="text-gray-600 text-sm">Grow your business without worrying about system limitations</p>
              </div>
                
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-[#3F78B1] mt-1 mr-3 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-900">Cost-Effective Solution</h4>
                </div>
                <p className="text-gray-600 text-sm">Reduce operational costs with optimized inventory management</p>
              </div>
                
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-[#3F78B1] mt-1 mr-3 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                </div>
                <p className="text-gray-600 text-sm">Round-the-clock assistance to keep your business running smoothly</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that have already optimized their supply chain with Martory
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-[#3F78B1] hover:bg-[#2F5A8A] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                onClick={() => window.location.href = '/Login'}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className="bg-white border border-[#3F78B1] text-[#3F78B1] hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                onClick={() => window.location.href = '/Login'}
              >
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}