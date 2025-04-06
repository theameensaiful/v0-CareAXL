"use client"

import { format, addDays } from "date-fns"
import { useRef, useEffect, useState } from "react"
import { User, Heart, Stethoscope, Pill, Activity, Thermometer } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the BottomSheet component
const BottomSheet = dynamic(() => import("../components/bottom-sheet"), { ssr: false })

interface ScheduleCalendarProps {
  startDate: Date
}

interface Appointment {
  day: number // 0-6 (Sun, Mon, Tue, Wed, Thu, Fri, Sat)
  hour: number // 0-23 (0 = 12am, 12 = 12pm, 23 = 11pm)
  patient: string // Patient name
  patientInitials: string // Patient initials
  appointmentType: "checkup" | "medication" | "therapy" | "vitals" | "wound" // Type of appointment
  duration: number // Duration in hours
}

export default function ScheduleCalendar({ startDate }: ScheduleCalendarProps) {
  // Refs for synchronized scrolling
  const horizontalScrollRef = useRef<HTMLDivElement>(null)
  const verticalScrollRef = useRef<HTMLDivElement>(null)
  const timeColumnRef = useRef<HTMLDivElement>(null)
  const dayHeaderRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef<HTMLDivElement>(null)

  // State for bottom sheet
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  // Handler for opening the bottom sheet
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsBottomSheetOpen(true)
  }

  // Handler for closing the bottom sheet
  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false)
  }

  // Generate days of the week (Sun through Sat)
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i)
    const today = new Date()
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    return {
      date,
      dayOfWeek: format(date, "EEE"), // Short day name
      dayNum: format(date, "d"),
      isToday,
    }
  })

  // Time slots for 24 hours in 12-hour format with 30-minute intervals
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minutes = i % 2 === 0 ? "00" : "30"
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const amPm = hour < 12 ? "a" : "p"
    return {
      hour: hour + (i % 2 === 0 ? 0 : 0.5),
      label: `${hour12}${minutes === "00" ? "" : ":30"}${amPm}`,
    }
  })

  // Sample appointments data with more details
  const appointments: Appointment[] = [
    {
      day: 1,
      hour: 10,
      patient: "Patricia Miller",
      patientInitials: "P.M.",
      appointmentType: "checkup",
      duration: 1,
    },
    {
      day: 1,
      hour: 14,
      patient: "Alexander Rodriguez",
      patientInitials: "A.R.",
      appointmentType: "medication",
      duration: 0.5,
    },
    {
      day: 2,
      hour: 11,
      patient: "Amanda Roberts",
      patientInitials: "A.R.",
      appointmentType: "therapy",
      duration: 1,
    },
    {
      day: 2,
      hour: 13,
      patient: "Michael Adams",
      patientInitials: "M.A.",
      appointmentType: "vitals",
      duration: 0.5,
    },
    {
      day: 2,
      hour: 15,
      patient: "Jennifer Smith",
      patientInitials: "J.S.",
      appointmentType: "wound",
      duration: 1,
    },
    {
      day: 3,
      hour: 9,
      patient: "Andrew Richards",
      patientInitials: "A.R.",
      appointmentType: "checkup",
      duration: 1,
    },
    {
      day: 3,
      hour: 14,
      patient: "Yasmin Martinez",
      patientInitials: "Y.M.",
      appointmentType: "medication",
      duration: 0.5,
    },
    {
      day: 4,
      hour: 10,
      patient: "Peter Morgan",
      patientInitials: "P.M.",
      appointmentType: "therapy",
      duration: 1,
    },
    {
      day: 4,
      hour: 12,
      patient: "Jessica Sanders",
      patientInitials: "J.S.",
      appointmentType: "vitals",
      duration: 0.5,
    },
    {
      day: 4,
      hour: 15,
      patient: "Kevin Lee",
      patientInitials: "K.L.",
      appointmentType: "wound",
      duration: 1,
    },
    {
      day: 5,
      hour: 9,
      patient: "Thomas Wilson",
      patientInitials: "T.W.",
      appointmentType: "checkup",
      duration: 1,
    },
    {
      day: 5,
      hour: 14,
      patient: "Barbara Cooper",
      patientInitials: "B.C.",
      appointmentType: "medication",
      duration: 0.5,
    },
    {
      day: 6,
      hour: 12,
      patient: "Sarah Johnson",
      patientInitials: "S.J.",
      appointmentType: "therapy",
      duration: 1,
    },
    {
      day: 6,
      hour: 14,
      patient: "Mark Nelson",
      patientInitials: "M.N.",
      appointmentType: "vitals",
      duration: 0.5,
    },
  ]

  // Function to get appointment for a specific day and hour
  const getAppointment = (day: number, hour: number) => {
    return appointments.find((apt) => apt.day === day && Math.floor(apt.hour) === hour)
  }

  // Function to check if a time slot is within working hours
  const isWorkingHour = (day: number, hour: number) => {
    // Sunday (day 0) is a leave day
    if (day === 0) return false

    // Saturday (day 6) working hours: 11am - 3pm
    if (day === 6) return hour >= 11 && hour < 15

    // Weekdays (Mon-Fri) working hours: 9am - 5pm
    return hour >= 9 && hour < 17
  }

  // Function to determine cell color based on appointments and working hours
  const getCellColor = (day: number, hour: number) => {
    if (day === 0) {
      return "bg-gray-100" // Light grey for leave day (Sunday)
    } else if (isWorkingHour(day, hour)) {
      return "bg-[#D1F5E4]" // Light green for working hours
    } else {
      return "bg-white" // White for non-working hours
    }
  }

  // Function to get appointment icon based on type
  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case "checkup":
        return <Stethoscope size={14} className="text-white" />
      case "medication":
        return <Pill size={14} className="text-white" />
      case "therapy":
        return <Heart size={14} className="text-white" />
      case "vitals":
        return <Activity size={14} className="text-white" />
      case "wound":
        return <Thermometer size={14} className="text-white" />
      default:
        return <User size={14} className="text-white" />
    }
  }

  // Function to get appointment background color based on type
  const getAppointmentColor = (type: string) => {
    switch (type) {
      case "checkup":
        return "bg-[#4B997B]" // Green
      case "medication":
        return "bg-[#7B4B99]" // Purple
      case "therapy":
        return "bg-[#1E88E5]" // Blue
      case "vitals":
        return "bg-[#FF9800]" // Orange
      case "wound":
        return "bg-[#F44336]" // Red
      default:
        return "bg-[#4B997B]" // Default green
    }
  }

  // Function to render appointment content
  const renderAppointment = (appointment: Appointment) => {
    return (
      <div
        className="w-full h-full flex flex-col items-start justify-center p-1 cursor-pointer"
        onClick={() => handleAppointmentClick(appointment)}
      >
        <div className={`w-full rounded-md p-1 ${getAppointmentColor(appointment.appointmentType)}`}>
          <div className="text-white text-xs font-medium text-left uppercase">{appointment.appointmentType}</div>
          <div className="text-white text-xs text-left truncate">{appointment.patient}</div>
        </div>
      </div>
    )
  }

  // Set up synchronized scrolling
  useEffect(() => {
    if (typeof window === "undefined") return

    const cellsElement = cellsRef.current
    const timeColumnElement = timeColumnRef.current
    const dayHeaderElement = dayHeaderRef.current

    if (!cellsElement || !timeColumnElement || !dayHeaderElement) return

    // Sync vertical scrolling between cells and time column
    const handleCellsVerticalScroll = () => {
      if (timeColumnElement) {
        timeColumnElement.scrollTop = cellsElement.scrollTop
      }
    }

    // Sync horizontal scrolling between cells and day header
    const handleCellsHorizontalScroll = () => {
      if (dayHeaderElement) {
        dayHeaderElement.scrollLeft = cellsElement.scrollLeft
      }
    }

    cellsElement.addEventListener("scroll", handleCellsVerticalScroll)
    cellsElement.addEventListener("scroll", handleCellsHorizontalScroll)

    return () => {
      cellsElement.removeEventListener("scroll", handleCellsVerticalScroll)
      cellsElement.removeEventListener("scroll", handleCellsHorizontalScroll)
    }
  }, [])

  // Initial scroll to 8am
  useEffect(() => {
    if (typeof window === "undefined") return

    const cellsElement = cellsRef.current
    if (cellsElement) {
      // Scroll to 8am (8 * 2 * 35px cell height for 30-min intervals)
      cellsElement.scrollTop = 8 * 2 * 35
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Day headers - fixed horizontally, scrolls with content */}
      <div className="ml-[60px] h-[60px] border-b border-[#E5E7EB] overflow-hidden">
        <div ref={dayHeaderRef} className="flex overflow-x-auto scrollbar-hide">
          {days.map((day, index) => (
            <div
              key={index}
              className={`flex-none w-[150px] h-[60px] p-2 text-center border-r border-[#E5E7EB] ${
                day.isToday ? "bg-[#1E88E5] text-white" : "bg-white"
              }`}
            >
              <div className="font-medium">{day.dayOfWeek}</div>
              <div className="text-lg">{day.dayNum}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time column - fixed vertically, scrolls with content */}
        <div className="w-[60px] flex-none overflow-hidden">
          <div ref={timeColumnRef} className="h-full overflow-y-auto scrollbar-hide">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className="h-[35px] flex-none border-b border-r border-[#E5E7EB] flex items-center justify-start pl-2 bg-white"
              >
                <span className="text-[#757575] text-xs">{slot.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar cells - scrollable both horizontally and vertically */}
        <div ref={cellsRef} className="flex-1 overflow-auto">
          <div className="inline-block min-w-max">
            {timeSlots.map((slot, rowIndex) => (
              <div key={rowIndex} className="flex h-[35px]">
                {days.map((_, colIndex) => {
                  const appointment = getAppointment(colIndex, slot.hour)
                  return (
                    <div
                      key={colIndex}
                      className={`w-[150px] h-[35px] flex-none border-r border-b border-[#E5E7EB] ${getCellColor(
                        colIndex,
                        slot.hour,
                      )}`}
                    >
                      {appointment ? renderAppointment(appointment) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend for appointment types */}
      <div className="p-2 border-t border-[#E5E7EB] bg-white flex flex-wrap justify-center gap-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#4B997B] flex items-center justify-center mr-1">
            <Stethoscope size={10} className="text-white" />
          </div>
          <span className="text-xs">Checkup</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#7B4B99] flex items-center justify-center mr-1">
            <Pill size={10} className="text-white" />
          </div>
          <span className="text-xs">Medication</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#1E88E5] flex items-center justify-center mr-1">
            <Heart size={10} className="text-white" />
          </div>
          <span className="text-xs">Therapy</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#FF9800] flex items-center justify-center mr-1">
            <Activity size={10} className="text-white" />
          </div>
          <span className="text-xs">Vitals</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#F44336] flex items-center justify-center mr-1">
            <Thermometer size={10} className="text-white" />
          </div>
          <span className="text-xs">Wound Care</span>
        </div>
      </div>

      {/* Bottom Sheet */}
      {isBottomSheetOpen && selectedAppointment && (
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={handleCloseBottomSheet}
          appointment={{
            id: selectedAppointment.day || 0,
            status: "upcoming",
            patientName: selectedAppointment.patient || "",
            address: "123 Main St, Anytown, USA",
            time: `${selectedAppointment.hour}:00 - ${selectedAppointment.hour + (selectedAppointment.duration || 0)}:00`,
            treatment: selectedAppointment.appointmentType || "",
            position: { lat: 0, lng: 0 },
          }}
        />
      )}
    </div>
  )
}

