"use client";
import SuperadminNavbar from '@/app/Components/SuperadminNavbar';
import SuperadminSidebar from '@/app/Components/SuperadminSidebar';
import AnalyticsDashboard from '@/app/Components/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <SuperadminSidebar />
      <div className="flex-1 flex flex-col">
        <SuperadminNavbar />
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
