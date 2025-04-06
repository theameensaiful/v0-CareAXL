"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { BottomNavigation } from "../components/bottom-navigation"
import { StatusBar } from "../components/status-bar"

type PatientStatus = "Active" | "Completed" | "Inactive"

interface Patient {
  id: number
  name: string
  gender: string
  dateOfBirth: string
  appointmentTime?: string
  image?: string
  initials?: string
  status?: PatientStatus
}

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState<"today" | "panel">("today")
  const router = useRouter()

  // Sample data for today's appointments
  const todayAppointments: Patient[] = [
    {
      id: 1,
      name: "Fred Tucker",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "09:30am",
      initials: "FT",
    },
    {
      id: 2,
      name: "Carole Sharp",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "10:15am",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Caroline Castaneda",
      gender: "F",
      dateOfBirth: "1970-04-06",
      appointmentTime: "11:00am",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 4,
      name: "Alejandro Pearson",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:30pm",
      initials: "AP",
    },
    {
      id: 5,
      name: "Kim Cook",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "01:45pm",
      initials: "KC",
    },
    {
      id: 6,
      name: "Mark Armstrong",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "03:00pm",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
      id: 7,
      name: "Micheal Curtis",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "04:15pm",
      initials: "MC",
    },
  ]

  // Sample data for patient panel
  const patientPanel: Patient[] = [
    {
      id: 1,
      name: "Fred Tucker",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:00pm",
      initials: "FT",
      status: "Active",
    },
    {
      id: 2,
      name: "Carole Sharp",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:00pm",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      status: "Active",
    },
    {
      id: 3,
      name: "Caroline Castaneda",
      gender: "F",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:00pm",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "Active",
    },
    {
      id: 4,
      name: "Alejandro Pearson",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:00pm",
      initials: "AP",
      status: "Active",
    },
    {
      id: 5,
      name: "Kim Cook",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:00pm",
      initials: "KC",
      status: "Active",
    },
    {
      id: 6,
      name: "Mark Armstrong",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:00pm",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      status: "Active",
    },
    {
      id: 7,
      name: "Micheal Curtis",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:00pm",
      initials: "MC",
      status: "Completed",
    },
    {
      id: 8,
      name: "Micheal Curtis",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:00pm",
      initials: "MC",
      status: "Completed",
    },
    {
      id: 9,
      name: "Micheal Curtis",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:00pm",
      initials: "MC",
      status: "Inactive",
    },
    {
      id: 10,
      name: "Micheal Curtis",
      gender: "M",
      dateOfBirth: "1970-04-06",
      appointmentTime: "12:00pm",
      initials: "MC",
      status: "Completed",
    },
  ]

  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case "Active":
        return "bg-[#D1F5E4] text-[#4B997B]"
      case "Completed":
        return "bg-[#E1EAFF] text-[#1E88E5]"
      case "Inactive":
        return "bg-[#FFE1E1] text-[#FF5252]"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  const handlePatientClick = (patientId: number) => {
    router.push(`/patients/${patientId}`)
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <StatusBar />

      <header className="px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#212121]">Patients</h1>
        <button className="p-2 text-[#768293]">
          <Search size={24} />
        </button>
      </header>

      <div className="border-t border-[#E5E7EB]"></div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB]">
        <button
          className={`flex-1 py-3 px-4 text-lg font-medium relative ${
            activeTab === "today" ? "text-primary" : "text-[#757575]"
          }`}
          onClick={() => setActiveTab("today")}
        >
          <div className="flex items-center justify-center">
            Today
            <span className="ml-2 px-2 py-0.5 bg-[#E1EAFF] text-primary rounded-full text-xs">
              {todayAppointments.length}
            </span>
          </div>
          {activeTab === "today" && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>}
        </button>
        <button
          className={`flex-1 py-3 px-4 text-lg font-medium relative ${
            activeTab === "panel" ? "text-primary" : "text-[#757575]"
          }`}
          onClick={() => setActiveTab("panel")}
        >
          <div className="flex items-center justify-center">
            My Panel
            <span className="ml-2 px-2 py-0.5 bg-[#E1EAFF] text-primary rounded-full text-xs">
              {patientPanel.length}
            </span>
          </div>
          {activeTab === "panel" && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>}
        </button>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "today" &&
          todayAppointments.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center px-4 py-3 border-b border-[#E5E7EB] active:bg-gray-100 cursor-pointer"
              onClick={() => handlePatientClick(patient.id)}
            >
              <div className="relative mr-4">
                {patient.image ? (
                  <img
                    src={patient.image || "/placeholder.svg"}
                    alt={patient.name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#757575] text-xl font-bold">
                    {patient.initials}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-medium text-[#212121]">{patient.name}</h2>
                <div className="flex items-center text-[#757575] text-sm mt-1">
                  <span className="mr-2">•</span>
                  <span className="mr-2">{patient.gender}</span>
                  <span className="mr-2">•</span>
                  <span className="mr-2">{patient.dateOfBirth}</span>
                  <span className="mr-2">•</span>
                  <span>{patient.appointmentTime}</span>
                </div>
              </div>
            </div>
          ))}

        {activeTab === "panel" &&
          patientPanel.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center px-4 py-3 border-b border-[#E5E7EB] active:bg-gray-100 cursor-pointer"
              onClick={() => handlePatientClick(patient.id)}
            >
              <div className="relative mr-4">
                {patient.image ? (
                  <img
                    src={patient.image || "/placeholder.svg"}
                    alt={patient.name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#757575] text-xl font-bold">
                    {patient.initials}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-medium text-[#212121]">{patient.name}</h2>
                <div className="flex items-center text-[#757575] text-sm mt-1">
                  <span className="mr-2">•</span>
                  <span className="mr-2">{patient.gender}</span>
                  <span className="mr-2">•</span>
                  <span>{patient.dateOfBirth}</span>
                </div>
              </div>

              {patient.status && (
                <div className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </div>
              )}
            </div>
          ))}
      </div>

      <BottomNavigation currentRoute="patients" />
    </div>
  )
}

