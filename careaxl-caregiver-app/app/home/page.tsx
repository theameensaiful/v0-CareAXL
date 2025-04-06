"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import { Clock, MapPin, CheckCircle, Circle, AlertCircle, Calendar, Bell, Clock3, AlertTriangle } from "lucide-react"
import { StatusBar } from "../components/status-bar"
import { BottomNavigation } from "../components/bottom-navigation"

interface Appointment {
  id: number
  patientName: string
  patientInitials?: string
  patientImage?: string
  time: string
  address: string
  treatment: string
  status: "completed" | "upcoming" | "next" | "cancelled"
  isUrgent?: boolean
}

interface ShiftConfirmation {
  status: "pending" | "confirmed" | "overdue"
  dueDate: Date
  periodStart: Date
  periodEnd: Date
}

export default function HomePage() {
  const router = useRouter()
  const [currentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState({
    completed: 0,
    upcoming: 0,
    total: 0,
  })
  const [hasNotifications] = useState(true)
  const [shiftConfirmation, setShiftConfirmation] = useState<ShiftConfirmation>({
    status: "pending",
    dueDate: addDays(new Date(), 3),
    periodStart: addDays(new Date(), 7),
    periodEnd: addDays(new Date(), 21),
  })

  // Fetch data on component mount
  useEffect(() => {
    // This would be an API call in a real app
    const fetchedAppointments: Appointment[] = [
      {
        id: 1,
        patientName: "Sarah Johnson",
        patientInitials: "SJ",
        time: "10:30 am - 11:00 am",
        address: "123 Main St, Sainte-Foy, QC",
        treatment: "Blood Pressure Check",
        status: "completed",
      },
      {
        id: 2,
        patientName: "Fred Tucker",
        patientInitials: "FT",
        time: "12:00 pm - 12:30 pm",
        address: "100 Elm Ridge Center Dr, Greece NY 14626",
        treatment: "Wound Care treatment",
        status: "next",
      },
      {
        id: 3,
        patientName: "Maria Garcia",
        patientInitials: "MG",
        time: "1:30 pm - 2:00 pm",
        address: "456 Oak Ave, Sainte-Foy, QC",
        treatment: "Medication Administration",
        status: "upcoming",
      },
      {
        id: 4,
        patientName: "Robert Chen",
        patientInitials: "RC",
        time: "2:30 pm - 3:00 pm",
        address: "789 Pine Rd, Sainte-Foy, QC",
        treatment: "Physical Therapy",
        status: "upcoming",
        isUrgent: true,
      },
    ]

    setAppointments(fetchedAppointments)

    // Calculate stats
    const completed = fetchedAppointments.filter((app) => app.status === "completed").length
    const total = fetchedAppointments.length
    setStats({
      completed,
      upcoming: total - completed,
      total,
    })
  }, [])

  const getNextAppointment = () => {
    return appointments.find((app) => app.status === "next")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-[#4B997B]"
      case "next":
        return "text-[#7B4B99]"
      case "upcoming":
        return "text-[#1E88E5]"
      case "cancelled":
        return "text-[#FF5252]"
      default:
        return "text-[#757575]"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-[#4B997B]" />
      case "next":
        return <Clock size={16} className="text-[#7B4B99]" />
      case "upcoming":
        return <Circle size={16} className="text-[#1E88E5]" />
      case "cancelled":
        return <AlertCircle size={16} className="text-[#FF5252]" />
      default:
        return <Circle size={16} className="text-[#757575]" />
    }
  }

  const handleAppointmentClick = (appointmentId: number) => {
    router.push(`/patients/${appointmentId}`)
  }

  const handleViewAllAppointments = () => {
    router.push("/my-schedule")
  }

  const handleViewRoutes = () => {
    router.push("/my-routes")
  }

  const handleNotificationsClick = () => {
    router.push("/notifications")
  }

  const handleConfirmShifts = () => {
    router.push("/my-schedule/edit-shifts")
  }

  const getShiftConfirmationStyle = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock3 size={16} className="text-[#FFA000]" />,
          text: "text-[#FFA000]",
          button: "bg-[#FFA000] hover:bg-[#FF8F00]",
        }
      case "confirmed":
        return {
          icon: <CheckCircle size={16} className="text-[#4CAF50]" />,
          text: "text-[#4CAF50]",
          button: "bg-[#4CAF50] hover:bg-[#388E3C]",
        }
      case "overdue":
        return {
          icon: <AlertTriangle size={16} className="text-[#F44336]" />,
          text: "text-[#F44336]",
          button: "bg-[#F44336] hover:bg-[#D32F2F]",
        }
      default:
        return {
          icon: <Clock3 size={16} className="text-[#FFA000]" />,
          text: "text-[#FFA000]",
          button: "bg-[#FFA000] hover:bg-[#FF8F00]",
        }
    }
  }

  const nextAppointment = getNextAppointment()
  const shiftStyle = getShiftConfirmationStyle(shiftConfirmation.status)

  return (
    <div className="flex flex-col h-screen bg-[#F4F5F7]">
      <StatusBar />

      {/* New Header UI with profile image and notification icon */}
      <header className="px-4 py-3 bg-white flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Saiful's profile"
            className="w-10 h-10 rounded-full object-cover mr-3"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-xl font-medium text-[#212121]">Hello Saiful</h1>
        </div>
        <button onClick={handleNotificationsClick} className="relative p-2 text-[#768293]">
          <Bell size={24} />
          {hasNotifications && <span className="absolute top-1 right-1 w-3 h-3 bg-[#FF5252] rounded-full"></span>}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Date */}
        <div className="px-4 py-3 bg-white border-t border-b border-[#E5E7EB]">
          <p className="text-[#757575]">Today, {format(currentDate, "EEEE, MMMM d, yyyy")}</p>
        </div>

        {/* Shift Confirmation Reminder */}
        <div className="px-4 py-4 mt-4 bg-white rounded-lg mx-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {shiftStyle.icon}
              <h3 className="text-lg font-medium ml-2">
                {shiftConfirmation.status === "pending" && "Shift Confirmation Required"}
                {shiftConfirmation.status === "confirmed" && "Shifts Confirmed"}
                {shiftConfirmation.status === "overdue" && "Shift Confirmation Overdue"}
              </h3>
            </div>
          </div>

          <p className="text-[#757575] mb-3">
            Please confirm your availability for the period of {format(shiftConfirmation.periodStart, "MMMM d")} -{" "}
            {format(shiftConfirmation.periodEnd, "MMMM d, yyyy")}
          </p>

          {shiftConfirmation.status !== "confirmed" && (
            <div className="flex justify-between items-center mt-3">
              {shiftConfirmation.status === "pending" && (
                <div className="px-3 py-1 rounded-full bg-[#E1EAFF] text-[#1E88E5] text-sm font-medium">
                  Due by {format(shiftConfirmation.dueDate, "MMM d")}
                </div>
              )}
              {shiftConfirmation.status === "overdue" && (
                <div className="px-3 py-1 rounded-full bg-[#FFEBEE] text-[#F44336] text-sm font-medium">Overdue</div>
              )}
              <button
                onClick={handleConfirmShifts}
                className={`px-6 py-2 text-white font-medium rounded-lg flex items-center justify-center ${shiftStyle.button}`}
              >
                Confirm Shifts
              </button>
            </div>
          )}
          {shiftConfirmation.status === "confirmed" && (
            <div className="flex justify-end mt-3">
              <div className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#4CAF50] text-sm font-medium">Thank you!</div>
            </div>
          )}
        </div>

        {/* Daily Progress */}
        <div className="px-4 py-4 mt-4 bg-white rounded-lg mx-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-[#212121]">Daily Progress</h3>
            <Calendar size={20} className="text-[#7B4B99]" />
          </div>

          <div className="flex justify-between mb-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#4B997B]">{stats.completed}</p>
              <p className="text-sm text-[#757575]">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1E88E5]">{stats.upcoming}</p>
              <p className="text-sm text-[#757575]">Upcoming</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#212121]">{stats.total}</p>
              <p className="text-sm text-[#757575]">Total</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full mt-3">
            <div
              className="h-2 bg-[#4B997B] rounded-full"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Next Appointment */}
        {nextAppointment && (
          <div className="px-4 py-4 mt-4 bg-white rounded-lg mx-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-[#212121]">Next Appointment</h3>
              <Clock size={20} className="text-[#7B4B99]" />
            </div>

            <div
              className="flex items-center p-3 bg-[#F9FAFB] rounded-lg cursor-pointer"
              onClick={() => handleAppointmentClick(nextAppointment.id)}
            >
              <div className="w-12 h-12 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#757575] text-lg font-bold mr-3">
                {nextAppointment.patientInitials}
              </div>

              <div className="flex-1">
                <p className="font-medium text-[#212121]">{nextAppointment.patientName}</p>
                <p className="text-sm text-[#757575]">{nextAppointment.time}</p>
                <p className="text-sm text-[#7B4B99]">{nextAppointment.treatment}</p>
              </div>
            </div>

            <button
              onClick={handleViewRoutes}
              className="w-full mt-3 py-2 bg-[#4B997B] text-white font-medium rounded-lg flex items-center justify-center"
            >
              <MapPin size={18} className="mr-2" />
              View Route
            </button>
          </div>
        )}

        {/* Today's Appointments */}
        <div className="px-4 py-4 mt-4 bg-white rounded-lg mx-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-[#212121]">Today's Appointments</h3>
            <Calendar size={20} className="text-[#7B4B99]" />
          </div>

          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center p-3 bg-[#F9FAFB] rounded-lg cursor-pointer"
                onClick={() => handleAppointmentClick(appointment.id)}
              >
                <div className="mr-3">{getStatusIcon(appointment.status)}</div>

                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium text-[#212121]">{appointment.patientName}</p>
                    {appointment.isUrgent && (
                      <span className="ml-2 px-2 py-0.5 bg-[#FECACA] text-[#EF4444] text-xs rounded-full">Urgent</span>
                    )}
                  </div>
                  <p className="text-sm text-[#757575]">{appointment.time}</p>
                </div>

                <span className={`text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleViewAllAppointments}
            className="w-full mt-3 py-2 border border-[#1E88E5] text-[#1E88E5] font-medium rounded-lg flex items-center justify-center"
          >
            View All Appointments
          </button>
        </div>
      </div>

      <BottomNavigation currentRoute="home" />
    </div>
  )
}

