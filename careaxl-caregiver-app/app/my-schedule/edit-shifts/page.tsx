"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, X, Clock, ChevronDown } from "lucide-react"
import { StatusBar } from "../../components/status-bar"

interface TimeSlot {
  startTime: string
  endTime: string
}

interface DaySchedule {
  day: string
  fullName: string
  slots: TimeSlot[]
}

export default function EditShiftsPage() {
  const router = useRouter()

  // Initial schedule data
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: "Sun", fullName: "Sunday", slots: [] },
    { day: "Mon", fullName: "Monday", slots: [{ startTime: "8:00a", endTime: "3:00p" }] },
    { day: "Tue", fullName: "Tuesday", slots: [{ startTime: "8:00a", endTime: "3:00p" }] },
    { day: "Wed", fullName: "Wednesday", slots: [{ startTime: "8:00a", endTime: "12:00p" }] },
    { day: "Thu", fullName: "Thursday", slots: [{ startTime: "8:00a", endTime: "3:00p" }] },
    { day: "Fri", fullName: "Friday", slots: [{ startTime: "8:00a", endTime: "3:00p" }] },
    { day: "Sat", fullName: "Saturday", slots: [{ startTime: "10:00a", endTime: "12:00p" }] },
  ])

  // State for time selection
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [selectedTimeType, setSelectedTimeType] = useState<"startTime" | "endTime" | null>(null)

  // Generate time options (30-min intervals)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const period = hour < 12 ? "a" : "p"
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const displayMinute = minute === 0 ? "" : `:${minute}`
      timeOptions.push(`${displayHour}${displayMinute}${period}`)
    }
  }

  // Function to add a new time slot to a day
  const addTimeSlot = (dayIndex: number) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[dayIndex].slots.push({ startTime: "9:00a", endTime: "5:00p" })
    setSchedule(updatedSchedule)
  }

  // Function to remove a time slot from a day
  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[dayIndex].slots.splice(slotIndex, 1)
    setSchedule(updatedSchedule)
  }

  // Function to open time picker
  const openTimePicker = (dayIndex: number, slotIndex: number, timeType: "startTime" | "endTime") => {
    setSelectedDay(dayIndex)
    setSelectedSlot(slotIndex)
    setSelectedTimeType(timeType)
    setIsTimePickerOpen(true)
  }

  // Function to select time
  const selectTime = (time: string) => {
    if (selectedDay !== null && selectedSlot !== null && selectedTimeType !== null) {
      const updatedSchedule = [...schedule]
      updatedSchedule[selectedDay].slots[selectedSlot][selectedTimeType] = time
      setSchedule(updatedSchedule)
      setIsTimePickerOpen(false)
    }
  }

  // Function to handle save
  const handleSave = () => {
    // Here you would typically save the schedule to your backend
    router.push("/my-schedule")
  }

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB]">
      <StatusBar />

      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between bg-white border-b border-[#E5E7EB] sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-3 text-[#768293]">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-[#212121]">Edit Weekly Shifts</h1>
        </div>
      </header>

      {/* Day schedules */}
      <div className="flex-1 overflow-y-auto pb-24">
        {schedule.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`border-b border-[#E5E7EB] ${dayIndex % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"}`}
          >
            <div className="px-4 py-4">
              {day.day === "Sun" ? (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-[#212121]">{day.day}</span>
                      <span className="text-xs text-[#757575]">{day.fullName}</span>
                    </div>
                  </div>
                  <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center mr-3">
                      <X size={16} className="text-[#EF4444]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#EF4444] font-medium">Not Available for Scheduling</p>
                      <p className="text-xs text-[#757575]">Sunday has been set as a leave day by administrator</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-[#212121]">{day.day}</span>
                      <span className="text-xs text-[#757575]">{day.fullName}</span>
                    </div>
                    {day.slots.length === 0 && (
                      <button
                        onClick={() => addTimeSlot(dayIndex)}
                        className="flex items-center justify-center px-3 py-1.5 bg-[#E1EAFF] rounded-full text-[#1E88E5] text-sm font-medium"
                      >
                        <Plus size={16} className="mr-1" />
                        Add shift
                      </button>
                    )}
                  </div>

                  {day.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="mb-3 bg-white rounded-lg p-3 shadow-sm border border-[#E5E7EB]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Clock size={16} className="text-[#1E88E5] mr-2" />
                          <span className="text-sm font-medium text-[#212121]">Shift {slotIndex + 1}</span>
                        </div>
                        <button
                          onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                          className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444]"
                          aria-label="Remove time slot"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="text-xs text-[#757575] mb-1">Start Time</div>
                          <button
                            onClick={() => openTimePicker(dayIndex, slotIndex, "startTime")}
                            className="w-full h-10 border border-[#E5E7EB] rounded-lg flex items-center justify-between px-3 text-[#212121] bg-white"
                          >
                            <span>{slot.startTime}</span>
                            <ChevronDown size={16} className="text-[#757575]" />
                          </button>
                        </div>

                        <div className="mx-2 text-[#757575] self-end mb-2">–</div>

                        <div className="flex-1">
                          <div className="text-xs text-[#757575] mb-1">End Time</div>
                          <button
                            onClick={() => openTimePicker(dayIndex, slotIndex, "endTime")}
                            className="w-full h-10 border border-[#E5E7EB] rounded-lg flex items-center justify-between px-3 text-[#212121] bg-white"
                          >
                            <span>{slot.endTime}</span>
                            <ChevronDown size={16} className="text-[#757575]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add button for days with existing slots */}
                  {day.slots.length > 0 && (
                    <button
                      onClick={() => addTimeSlot(dayIndex)}
                      className="flex items-center justify-center w-full py-2 border border-dashed border-[#1E88E5] rounded-lg text-[#1E88E5] text-sm font-medium mt-2"
                    >
                      <Plus size={16} className="mr-1" />
                      Add another shift
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save button - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB] shadow-md z-10">
        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#1E88E5] text-white font-medium rounded-lg flex items-center justify-center"
        >
          Submit shift hours
        </button>
      </div>

      {/* Time picker bottom sheet */}
      {isTimePickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-xl max-h-[70vh] overflow-y-auto">
            <div className="p-4 border-b border-[#E5E7EB] sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <button onClick={() => setIsTimePickerOpen(false)} className="text-[#757575]">
                  Cancel
                </button>
                <h3 className="text-lg font-medium">
                  Select {selectedTimeType === "startTime" ? "Start" : "End"} Time
                </h3>
                <div className="w-14"></div> {/* Spacer for centering */}
              </div>
            </div>

            <div className="p-2">
              <div className="grid grid-cols-3 gap-2">
                {timeOptions.map((time, index) => (
                  <button
                    key={index}
                    className="py-3 px-2 text-center text-[#212121] hover:bg-[#E1EAFF] focus:bg-[#E1EAFF] rounded-lg"
                    onClick={() => selectTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

