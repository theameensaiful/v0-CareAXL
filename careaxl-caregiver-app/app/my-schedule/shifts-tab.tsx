"use client"

import { useRouter } from "next/navigation"
import { Edit, Clock } from "lucide-react"

interface TimeSlot {
  startTime: string
  endTime: string
}

interface DaySchedule {
  day: string
  fullName: string
  slots: TimeSlot[]
}

export default function ShiftsTab() {
  const router = useRouter()

  // Sample schedule data
  const schedule: DaySchedule[] = [
    { day: "Sun", fullName: "Sunday", slots: [] },
    { day: "Mon", fullName: "Monday", slots: [{ startTime: "8:00a", endTime: "3:00p" }] },
    { day: "Tue", fullName: "Tuesday", slots: [{ startTime: "8:00a", endTime: "3:00p" }] },
    { day: "Wed", fullName: "Wednesday", slots: [{ startTime: "8:00a", endTime: "12:00p" }] },
    { day: "Thu", fullName: "Thursday", slots: [{ startTime: "8:00a", endTime: "3:00p" }] },
    { day: "Fri", fullName: "Friday", slots: [{ startTime: "8:00a", endTime: "3:00p" }] },
    { day: "Sat", fullName: "Saturday", slots: [{ startTime: "10:00a", endTime: "12:00p" }] },
  ]

  const handleEditClick = () => {
    router.push("/my-schedule/edit-shifts")
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with Edit button */}
      <div className="px-4 py-3 flex justify-between items-center border-b border-[#E5E7EB] bg-white sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-[#212121]">Weekly Availability</h2>
        <button
          onClick={handleEditClick}
          className="p-2 text-[#768293] hover:text-[#9A68B8] transition-colors"
          aria-label="Edit schedule"
        >
          <Edit size={20} />
        </button>
      </div>

      {/* Day schedules */}
      <div className="flex-1 overflow-y-auto">
        {schedule.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`border-b border-[#E5E7EB] ${dayIndex % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"}`}
          >
            <div className="px-4 py-4 flex items-start">
              <div className="w-24 flex flex-col">
                <span className="text-base font-semibold text-[#212121]">{day.day}</span>
                <span className="text-xs text-[#757575]">{day.fullName}</span>
              </div>

              <div className="flex-1">
                {day.slots.length === 0 ? (
                  <div className="flex items-center text-[#757575] text-base">
                    <span className="italic">Leave</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {day.slots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[#E1EAFF] flex items-center justify-center mr-2">
                          <Clock size={14} className="text-[#1E88E5]" />
                        </div>
                        <span className="text-base font-medium text-[#212121]">
                          {slot.startTime} – {slot.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

