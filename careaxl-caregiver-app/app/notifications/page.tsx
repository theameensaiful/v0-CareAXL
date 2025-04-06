"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import {
  ChevronLeft,
  Bell,
  Clock,
  Calendar,
  ArrowUpDownIcon as ArrowsUpDown,
  X,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
} from "lucide-react"
import { StatusBar } from "../components/status-bar"
import { motion } from "framer-motion"

// Define notification types
type NotificationType = "assignment" | "shift_confirmation" | "swap_request"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  isRead: boolean
  data?: any // Additional data specific to notification type
}

const fixedBottomSheetStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  maxHeight: "80vh",
  overflowY: "hidden",
  transform: "translateY(0)",
  transition: "none",
}

export default function NotificationsPage() {
  const router = useRouter()
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [isRefusalMode, setIsRefusalMode] = useState(false)
  const [refusalReason, setRefusalReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const refusalInputRef = useRef<HTMLDivElement>(null)
  const bottomSheetRef = useRef<HTMLDivElement>(null)

  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "assignment",
      title: "New appointment assigned",
      message: "You have been assigned to care for Fred Tucker",
      timestamp: "2025-04-05T10:30:00",
      isRead: false,
      data: {
        patientName: "Fred Tucker",
        patientInitials: "FT",
        appointmentTime: "12:00 pm - 12:30 pm",
        appointmentDate: "April 7, 2025",
        address: "100 Elm Ridge Center Dr, Greece NY 14626",
        treatment: "Wound Care treatment",
        id: 2,
        status: "upcoming",
        position: { lat: 46.762, lng: -71.295 },
      },
    },
    {
      id: "2",
      type: "shift_confirmation",
      title: "Shift confirmation required",
      message: "Please confirm your shifts for April 7 - April 21",
      timestamp: "2025-04-04T09:15:00",
      isRead: true,
      data: {
        dueDate: "2025-04-07",
        periodStart: "2025-04-07",
        periodEnd: "2025-04-21",
      },
    },
    {
      id: "3",
      type: "swap_request",
      title: "Shift swap request",
      message: "Maria Garcia requested to swap shifts with you",
      timestamp: "2025-04-03T14:45:00",
      isRead: false,
      data: {
        requesterName: "Maria Garcia",
        requesterShift: {
          date: "2025-04-10",
          time: "8:00 am - 3:00 pm",
        },
        yourShift: {
          date: "2025-04-12",
          time: "10:00 am - 2:00 pm",
        },
      },
    },
    {
      id: "4",
      type: "assignment",
      title: "New appointment assigned",
      message: "You have been assigned to care for Robert Chen",
      timestamp: "2025-04-02T16:20:00",
      isRead: true,
      data: {
        patientName: "Robert Chen",
        patientInitials: "RC",
        appointmentTime: "2:30 pm - 3:00 pm",
        appointmentDate: "April 8, 2025",
        address: "789 Pine Rd, Sainte-Foy, QC",
        treatment: "Physical Therapy",
        id: 4,
        status: "upcoming",
        position: { lat: 46.765, lng: -71.315 },
        isUrgent: true,
      },
    },
    {
      id: "5",
      type: "assignment",
      title: "Appointment rescheduled",
      message: "Your appointment with Sarah Johnson has been rescheduled",
      timestamp: "2025-04-01T11:20:00",
      isRead: false,
      data: {
        patientName: "Sarah Johnson",
        patientInitials: "SJ",
        appointmentTime: "11:30 am - 12:00 pm",
        appointmentDate: "April 9, 2025",
        address: "123 Main St, Sainte-Foy, QC",
        treatment: "Blood Pressure Check",
        id: 1,
        status: "upcoming",
        position: { lat: 46.769, lng: -71.282 },
      },
    },
    {
      id: "6",
      type: "swap_request",
      title: "Shift swap approved",
      message: "Your shift swap with Thomas Wilson has been approved",
      timestamp: "2025-03-31T15:10:00",
      isRead: true,
      data: {
        requesterName: "Thomas Wilson",
        requesterShift: {
          date: "2025-04-15",
          time: "9:00 am - 4:00 pm",
        },
        yourShift: {
          date: "2025-04-18",
          time: "8:00 am - 3:00 pm",
        },
      },
    },
    {
      id: "7",
      type: "assignment",
      title: "Appointment cancelled",
      message: "Your appointment with Emily Wilson has been cancelled",
      timestamp: "2025-03-30T09:45:00",
      isRead: true,
      data: {
        patientName: "Emily Wilson",
        patientInitials: "EW",
        appointmentTime: "3:30 pm - 4:00 pm",
        appointmentDate: "April 5, 2025",
        address: "321 Maple Dr, Laval, QC",
        treatment: "Wound Dressing",
        id: 5,
        status: "cancelled",
        position: { lat: 46.775, lng: -71.3 },
      },
    },
    {
      id: "8",
      type: "shift_confirmation",
      title: "Shifts confirmed",
      message: "Your shifts for March 24 - April 7 have been confirmed",
      timestamp: "2025-03-29T16:30:00",
      isRead: true,
      data: {
        periodStart: "2025-03-24",
        periodEnd: "2025-04-07",
      },
    },
  ])

  const handleBack = () => {
    router.back()
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
    )

    // Open bottom sheet for assignment notifications
    if (notification.type === "assignment") {
      setSelectedNotification(notification)
      setIsBottomSheetOpen(true)
      setIsRefusalMode(false) // Reset refusal mode
    } else if (notification.type === "shift_confirmation") {
      router.push("/my-schedule/edit-shifts")
    } else if (notification.type === "swap_request") {
      // For now, just show the notification details
      setSelectedNotification(notification)
      setIsBottomSheetOpen(true)
      setIsRefusalMode(false) // Reset refusal mode
    }
  }

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false)
    setIsRefusalMode(false)
    setRefusalReason("")
  }

  const handleRefusal = () => {
    // First close the bottom sheet completely
    setIsBottomSheetOpen(false)

    // Wait for the bottom sheet to close before showing the refusal form
    setTimeout(() => {
      setIsRefusalMode(true)
      setRefusalReason("")

      // Focus the contentEditable div after a delay
      setTimeout(() => {
        if (refusalInputRef.current) {
          refusalInputRef.current.focus()

          // Create a range and set the cursor at the beginning
          const range = document.createRange()
          const selection = window.getSelection()
          range.setStart(refusalInputRef.current, 0)
          range.collapse(true)

          if (selection) {
            selection.removeAllRanges()
            selection.addRange(range)
          }

          // Ensure the keyboard appears on mobile
          refusalInputRef.current.click()
        }
      }, 300)
    }, 500)
  }

  const handleCancelRefusal = () => {
    // Go back to appointment details
    setIsRefusalMode(false)
    setRefusalReason("")
  }

  const handleSubmitRefusal = () => {
    if (!refusalReason.trim()) {
      // Show error if no reason provided
      alert("Please provide a reason for refusal")
      return
    }

    setIsSubmitting(true)

    // Simulate API call with a timeout
    setTimeout(() => {
      // In a real app, you would send this to your backend
      console.log("Appointment refused with reason:", refusalReason)

      // Show success message
      setShowSuccessMessage(true)

      // Hide success message after 3 seconds and close bottom sheet
      setTimeout(() => {
        setShowSuccessMessage(false)
        setIsBottomSheetOpen(false)
        setIsRefusalMode(false)

        // Reset state
        setRefusalReason("")
        setIsSubmitting(false)

        // Remove the notification from the list or mark it as handled
        if (selectedNotification) {
          setNotifications(notifications.filter((n) => n.id !== selectedNotification.id))
        }
      }, 3000)
    }, 1000)
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "assignment":
        return <Calendar size={20} className="text-[#7B4B99]" />
      case "shift_confirmation":
        return <Clock size={20} className="text-[#FFA000]" />
      case "swap_request":
        return <ArrowsUpDown size={20} className="text-[#1E88E5]" />
      default:
        return <Bell size={20} className="text-[#768293]" />
    }
  }

  const getNotificationColor = (type: NotificationType, isRead: boolean) => {
    if (isRead) return "bg-white"

    switch (type) {
      case "assignment":
        return "bg-[#F3E5FF] border-l-4 border-l-[#7B4B99]"
      case "shift_confirmation":
        return "bg-[#FFF8E1] border-l-4 border-l-[#FFA000]"
      case "swap_request":
        return "bg-[#E1EAFF] border-l-4 border-l-[#1E88E5]"
      default:
        return "bg-white"
    }
  }

  // Refusal Form Component - completely isolated approach
  const RefusalForm = () => {
    // Create a container div that will hold our form
    return (
      <div
        className="fixed inset-0 bg-white z-[1000]"
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {/* Fixed header */}
        <div className="flex items-center px-4 py-3 border-b border-[#E5E7EB] bg-white">
          <button onClick={handleCancelRefusal} className="mr-3 text-[#768293]">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-[#212121] flex items-center">
            <AlertCircle size={18} className="text-[#FF5252] mr-2" />
            Refuse Appointment
          </h2>
        </div>

        {showSuccessMessage ? (
          <div className="flex-1 flex items-center justify-center bg-white" style={{ height: "calc(100% - 60px)" }}>
            <div className="text-center p-6 bg-[#E8F5E9] rounded-lg max-w-xs mx-auto">
              <CheckCircle size={48} className="text-[#4CAF50] mx-auto mb-3" />
              <p className="text-[#4CAF50] font-medium">Appointment refused successfully!</p>
              <p className="text-[#757575] text-sm mt-2">A notification will be sent to the administrator.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Content area */}
            <div className="p-4" style={{ height: "calc(100% - 130px)", overflowY: "auto" }}>
              <p className="text-[#757575] mb-4">
                Please provide a reason for refusing this appointment. This information will be sent to the
                administrator.
              </p>

              {/* ContentEditable div instead of input/textarea */}
              <div style={{ position: "relative", zIndex: 2000 }}>
                <div
                  ref={refusalInputRef}
                  contentEditable
                  onInput={(e) => setRefusalReason(e.currentTarget.textContent || "")}
                  onBlur={(e) => e.preventDefault()}
                  onClick={(e) => e.currentTarget.focus()}
                  onTouchStart={(e) => {
                    e.stopPropagation()
                    e.currentTarget.focus()
                  }}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    minHeight: "150px",
                    fontSize: "16px",
                    zIndex: 2000,
                    position: "relative",
                    backgroundColor: "white",
                    outline: "none",
                    overflowY: "auto",
                    WebkitUserSelect: "text",
                    userSelect: "text",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                  suppressContentEditableWarning
                >
                  {refusalReason}
                </div>
              </div>
            </div>

            {/* Fixed footer */}
            <div
              className="p-4 border-t border-[#E5E7EB] bg-white"
              style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            >
              <button
                onClick={handleSubmitRefusal}
                className="w-full py-3 bg-[#FF5252] text-white font-medium rounded-lg flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <X size={18} className="mr-2" />
                    Refuse Appointment
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  // Custom bottom sheet for notifications
  const NotificationBottomSheet = () => {
    if (!selectedNotification) return null

    if (selectedNotification.type === "assignment") {
      const appointmentData = selectedNotification.data

      return (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={bottomSheetRef}
            className="bg-white rounded-t-2xl max-h-[80vh] overflow-hidden flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag={isRefusalMode ? false : "y"}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                handleCloseBottomSheet()
              }
            }}
            style={{
              touchAction: isRefusalMode ? "none" : "pan-y",
              ...(isRefusalMode ? fixedBottomSheetStyle : {}),
            }}
          >
            {/* Handle bar */}
            <div className="w-full flex justify-center pt-2 pb-4">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <>
              {/* Patient info header */}
              <div className="flex items-center px-4 pb-4">
                <div className="relative mr-4">
                  <div className="w-14 h-14 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#757575] text-xl font-bold">
                    {appointmentData.patientInitials}
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary absolute -bottom-1 left-5"></div>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#212121]">{appointmentData.patientName}</h2>
                  <p className="text-[#757575]">{appointmentData.address}</p>
                  <p className="text-[#757575]">(508) 987-6543</p>
                </div>
              </div>

              {/* Appointment details */}
              <div className="px-4 py-3 bg-[#F9FAFB] border-t border-b border-[#E5E7EB]">
                <div className="flex items-center mb-2">
                  <Calendar size={18} className="text-[#7B4B99] mr-2" />
                  <span className="font-medium">{appointmentData.appointmentDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="text-[#7B4B99] mr-2" />
                  <span className="font-medium">{appointmentData.appointmentTime}</span>
                </div>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-3 border-b border-[#E5E7EB]">
                  <h3 className="text-base font-medium text-[#757575] uppercase mb-2">ORDERS</h3>

                  {appointmentData.isUrgent && (
                    <div className="mb-3 px-3 py-1 bg-[#FFEBEE] text-[#F44336] text-sm font-medium inline-block rounded-full">
                      Urgent
                    </div>
                  )}

                  <h4 className="text-[#212121] font-medium mb-2">{appointmentData.treatment}</h4>

                  <div className="py-3 px-4 bg-[#F4F5F7] rounded-md mb-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#4B997B] rounded-full mr-2"></div>
                      <p className="text-[#212121]">Conduct wound assessment</p>
                    </div>
                  </div>
                  <div className="py-3 px-4 bg-[#F4F5F7] rounded-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#4B997B] rounded-full mr-2"></div>
                      <p className="text-[#212121]">Change dressing using sterile technique</p>
                    </div>
                  </div>
                </div>

                {/* Notes section - placeholder */}
                <div className="px-4 py-3 mb-20">
                  <h3 className="text-base font-medium text-[#757575] uppercase mb-2">NOTES</h3>
                  <p className="text-[#212121]">
                    Patient has a history of hypertension. Please check blood pressure before treatment.
                  </p>
                </div>
              </div>

              {/* Fixed refusal button at bottom */}
              <div className="p-4 bg-white border-t border-[#E5E7EB] shadow-md">
                <button
                  onClick={handleRefusal}
                  className="w-full py-3 bg-[#FF5252] text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <X size={18} className="mr-2" />
                  Refuse Appointment
                </button>
              </div>
            </>
          </motion.div>
        </motion.div>
      )
    } else if (selectedNotification.type === "swap_request") {
      const swapData = selectedNotification.data

      return (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={bottomSheetRef}
            className="bg-white rounded-t-2xl max-h-[80vh] overflow-hidden flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag={isRefusalMode ? false : "y"}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                handleCloseBottomSheet()
              }
            }}
            style={{ touchAction: isRefusalMode ? "none" : "pan-y" }}
          >
            {/* Handle bar */}
            <div className="w-full flex justify-center pt-2 pb-4">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-3">
                <h2 className="text-xl font-bold text-[#212121] mb-4">Shift Swap Request</h2>

                <p className="text-[#757575] mb-4">{swapData.requesterName} has requested to swap shifts with you:</p>

                <div className="bg-[#F9FAFB] rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-[#212121] mb-2">Their Shift:</h3>
                  <div className="flex items-center mb-1">
                    <Calendar size={16} className="text-[#7B4B99] mr-2" />
                    <span>{format(parseISO(swapData.requesterShift.date), "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="text-[#7B4B99] mr-2" />
                    <span>{swapData.requesterShift.time}</span>
                  </div>
                </div>

                <div className="bg-[#F9FAFB] rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-[#212121] mb-2">Your Shift:</h3>
                  <div className="flex items-center mb-1">
                    <Calendar size={16} className="text-[#7B4B99] mr-2" />
                    <span>{format(parseISO(swapData.yourShift.date), "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="text-[#7B4B99] mr-2" />
                    <span>{swapData.yourShift.time}</span>
                  </div>
                </div>

                <div className="flex space-x-4 mb-6">
                  <button
                    className="flex-1 py-3 bg-[#4B997B] text-white font-medium rounded-lg"
                    onClick={() => {
                      alert("Swap accepted!")
                      setIsBottomSheetOpen(false)
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="flex-1 py-3 bg-[#FF5252] text-white font-medium rounded-lg"
                    onClick={handleRefusal}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )
    }

    return null
  }

  return (
    <div className="flex flex-col h-screen bg-[#F4F5F7]">
      <StatusBar />

      {/* Header */}
      <header className="px-4 py-3 bg-white flex items-center">
        <button onClick={handleBack} className="mr-4 text-[#768293]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-[#212121]">Notifications</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <Bell size={48} className="text-[#E5E7EB] mb-4" />
            <p className="text-[#757575] text-center">No notifications yet</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${getNotificationColor(notification.type, notification.isRead)}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#212121]">{notification.title}</h3>
                    <p className="text-[#757575] text-sm mt-1">{notification.message}</p>
                    <p className="text-[#9AA6B6] text-xs mt-2">
                      {format(parseISO(notification.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  {!notification.isRead && <div className="w-3 h-3 rounded-full bg-[#7B4B99]"></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Bottom Sheet for Notifications */}
      {isBottomSheetOpen && <NotificationBottomSheet />}

      {/* Separate Refusal Form Modal */}
      {isRefusalMode && <RefusalForm />}
    </div>
  )
}

