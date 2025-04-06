"use client"

import { User, Navigation2 } from "lucide-react"
import Link from "next/link"

interface Appointment {
  id: number
  status: string
  patientName: string
  address: string
  time: string
  treatment: string
  position: {
    lat: number
    lng: number
  }
}

interface NextVisitProps {
  appointment: Appointment
}

export default function NextVisit({ appointment }: NextVisitProps) {
  return (
    <div className="bg-white rounded-t-lg shadow-lg">
      <div className="flex items-center px-4 pt-4 pb-2">
        <User className="text-[#7B4B99] mr-3" size={24} />
        <h3 className="text-lg font-medium text-[#7B4B99]">Next visit</h3>
        <span className="ml-auto text-[#768293]">10 min (4.4mi)</span>
      </div>

      <div className="flex px-4 pb-4">
        <div className="flex flex-col items-center justify-center pr-4 border-r border-[#E5E7EB] min-w-[110px]">
          <span className="text-[#7B4B99] text-lg">{appointment.time.split(" - ")[0]}</span>
          <span className="text-[#7B4B99]">-</span>
          <span className="text-[#7B4B99] text-lg">{appointment.time.split(" - ")[1]}</span>
        </div>

        <div className="pl-4">
          <h4 className="text-lg font-medium text-[#212121]">{appointment.patientName}</h4>
          <p className="text-[#757575] mb-1">{appointment.address}</p>
          <p className="text-[#7B4B99]">{appointment.treatment}</p>
        </div>
      </div>

      <Link
        href="/my-routes/route-planning"
        className="w-full py-4 bg-[#4B997B] hover:bg-[#68B89A] text-white font-medium flex items-center justify-center"
      >
        <Navigation2 className="mr-2" size={20} />
        Start Routing
      </Link>
    </div>
  )
}

