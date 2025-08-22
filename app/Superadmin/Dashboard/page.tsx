"use client";
import React from 'react'
import SuperadminNavbar from '@/app/Components/SuperadminNavbar'
import SuperadminSidebar from '@/app/Components/SuperadminSidebar'
import DashboardOverview from '@/app/Components/DashboardOverview'

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <SuperadminSidebar />
      <div className="flex-1 flex flex-col">
        <SuperadminNavbar />
        <DashboardOverview />
      </div>
    </div>
  )
}
