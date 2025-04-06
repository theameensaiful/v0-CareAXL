"use client"

import { useState } from "react"
import { format, addDays, subDays } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import { BottomNavigation } from "../components/bottom-navigation"
import { StatusBar } from "../components/status-bar"

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  ),
})

// Dynamically import the NextVisit component
const NextVisit = dynamic(() => import("./next-visit"), { ssr: false })

export default function MyRoutesPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 27)) // March 27, 2025

  const goToPreviousDay = () => {
    setCurrentDate((prev) => subDays(prev, 1))
  }

  const goToNextDay = () => {
    setCurrentDate((prev) => addDays(prev, 1))
  }

  // Sample appointment data
  const appointments = [
    {
      id: 1,
      status: "completed",
      patientName: "Sarah Johnson",
      address: "123 Main St, Sainte-Foy, QC",
      time: "10:30 am - 11:00 am",
      treatment: "Blood Pressure Check",
      position: { lat: 46.769, lng: -71.282 },
    },
    {
      id: 2,
      status: "next",
      patientName: "Fred Tucker",
      address: "100 Elm Ridge Center Dr, Greece NY 14626",
      time: "12:00 pm - 12:30 pm",
      treatment: "Wound Care treatment",
      position: { lat: 46.762, lng: -71.295 },
    },
    {
      id: 3,
      status: "upcoming",
      patientName: "Maria Garcia",
      address: "456 Oak Ave, Sainte-Foy, QC",
      time: "1:30 pm - 2:00 pm",
      treatment: "Medication Administration",
      position: { lat: 46.755, lng: -71.305 },
    },
    {
      id: 4,
      status: "upcoming",
      patientName: "Robert Chen",
      address: "789 Pine Rd, Sainte-Foy, QC",
      time: "2:30 pm - 3:00 pm",
      treatment: "Physical Therapy",
      position: { lat: 46.765, lng: -71.315 },
    },
    {
      id: 5,
      status: "cancelled",
      patientName: "Emily Wilson",
      address: "321 Maple Dr, Laval, QC",
      time: "3:30 pm - 4:00 pm",
      treatment: "Wound Dressing",
      position: { lat: 46.775, lng: -71.3 },
    },
    {
      id: 6,
      status: "upcoming",
      patientName: "James Brown",
      address: "654 Cedar Ln, Laval, QC",
      time: "4:30 pm - 5:00 pm",
      treatment: "Diabetes Management",
      position: { lat: 46.785, lng: -71.29 },
    },
  ]

  const nextAppointment = appointments.find((app) => app.status === "next")

  return (
    <div className="flex flex-col h-screen bg-[#F4F5F7]">
      <StatusBar />

      <header className="px-4 py-3 bg-white">
        <h1 className="text-2xl font-semibold text-[#212121]">My Routes</h1>
      </header>

      <div className="border-t border-[#E5E7EB]"></div>

      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <button onClick={goToPreviousDay} className="p-2 text-[#768293] hover:text-[#9AA6B6]">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-medium text-[#212121]">{format(currentDate, "d MMMM yyyy")}</h2>
        <button onClick={goToNextDay} className="p-2 text-[#768293] hover:text-[#9AA6B6]">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex-1 relative">
        <MapComponent appointments={appointments} />
      </div>

      {nextAppointment && <NextVisit appointment={nextAppointment} />}

      <BottomNavigation currentRoute="my-routes" />
    </div>
  )
}

