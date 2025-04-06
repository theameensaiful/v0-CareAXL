"use client"

import { useState } from "react"
import { format, addDays, subDays, startOfWeek } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { StatusBar } from "../components/status-bar"
import { BottomNavigation } from "../components/bottom-navigation"
import dynamic from "next/dynamic"

// Dynamically import components with no SSR
const ScheduleCalendar = dynamic(() => import("./schedule-calendar"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  ),
})

const ShiftsTab = dynamic(() => import("./shifts-tab"), { ssr: false })

export default function MySchedulePage() {
  // Use a string representation of the date to avoid serialization issues
  const initialDate = new Date(2025, 2, 10)
  const [currentDate, setCurrentDate] = useState(startOfWeek(initialDate, { weekStartsOn: 0 }))
  const [activeTab, setActiveTab] = useState<"calendar" | "shifts" | "timeoff">("calendar")

  const goToPreviousWeek = () => {
    setCurrentDate((prev) => subDays(prev, 7))
  }

  const goToNextWeek = () => {
    setCurrentDate((prev) => addDays(prev, 7))
  }

  // Calculate the end date (6 days after the current date, which is Saturday)
  const endDate = addDays(currentDate, 6)

  // Format the date range for display
  const dateRangeText = `${format(currentDate, "MMMM d")}–${format(endDate, "d, yyyy")}`

  return (
    <div className="flex flex-col h-screen bg-[#F4F5F7]">
      <StatusBar />

      <header className="px-4 py-3 bg-white">
        <h1 className="text-2xl font-semibold text-[#212121]">My Schedule</h1>
      </header>

      {/* Tabs */}
      <div className="flex bg-white border-t border-b border-[#E5E7EB]">
        <button
          className={`flex-1 py-3 text-base font-medium relative ${
            activeTab === "calendar" ? "text-[#1E88E5]" : "text-[#757575]"
          }`}
          onClick={() => setActiveTab("calendar")}
        >
          Calendar
          {activeTab === "calendar" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1E88E5]"></div>}
        </button>
        <button
          className={`flex-1 py-3 text-base font-medium relative ${
            activeTab === "shifts" ? "text-[#1E88E5]" : "text-[#757575]"
          }`}
          onClick={() => setActiveTab("shifts")}
        >
          Shifts
          {activeTab === "shifts" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1E88E5]"></div>}
        </button>
        <button
          className={`flex-1 py-3 text-base font-medium relative ${
            activeTab === "timeoff" ? "text-[#1E88E5]" : "text-[#757575]"
          }`}
          onClick={() => setActiveTab("timeoff")}
        >
          Time Off
          {activeTab === "timeoff" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1E88E5]"></div>}
        </button>
      </div>

      {/* Date Navigation - only show for calendar tab */}
      {activeTab === "calendar" && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E7EB]">
          <h2 className="text-base font-medium text-[#212121]">{dateRangeText}</h2>
          <div className="flex">
            <button onClick={goToPreviousWeek} className="p-2 text-[#768293] hover:text-[#9AA6B6]">
              <ChevronLeft size={24} />
            </button>
            <button onClick={goToNextWeek} className="p-2 text-[#768293] hover:text-[#9AA6B6]">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "calendar" && <ScheduleCalendar startDate={currentDate} />}
        {activeTab === "shifts" && <ShiftsTab />}
        {activeTab === "timeoff" && <div className="p-4 text-center text-[#757575]">Time Off content coming soon</div>}
      </div>

      <BottomNavigation currentRoute="my-schedule" />
    </div>
  )
}

