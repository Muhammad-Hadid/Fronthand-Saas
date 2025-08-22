"use client";
import SuperadminNavbar from '@/app/Components/SuperadminNavbar';
import SuperadminSidebar from '@/app/Components/SuperadminSidebar';
import StockOverview from '@/app/Components/StockOverview';

export default function OverviewPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <SuperadminSidebar />
      <div className="flex-1 flex flex-col">
        <SuperadminNavbar />
        <StockOverview />
      </div>
    </div>
  );
}


