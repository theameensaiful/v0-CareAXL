"use client"

import { useRef, useState, useEffect } from "react"
import { motion, type PanInfo, useAnimation } from "framer-motion"
import { ChevronLeft, ChevronRight, Navigation2, Phone, LogIn, Ban, Edit, Wrench, Wand2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  appointment: {
    id: number
    status: string
    patientName: string
    address: string
    time: string
    treatment: string
    position: { lat: number; lng: number }
  }
  onPrevious?: () => void
  onNext?: () => void
}

export function BottomSheet({ isOpen, onClose, appointment, onPrevious, onNext }: BottomSheetProps) {
  const router = useRouter()
  const [sheetState, setSheetState] = useState<"partial" | "full">("partial")
  const controls = useAnimation()
  const sheetRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const initialY = typeof window !== "undefined" ? window.innerHeight - 400 : 0 // Partial height
  const fullY = 100 // Full height position from top

  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState("Has a friendly dog, Pete at home")
  const [isTextExpanded, setIsTextExpanded] = useState(false)

  const shortSummary =
    "Fred Tucker, 49 years old, was admitted on 02/12/2025 with symptoms of severe abdominal pain and diagnosed with acute appen..."
  const fullSummary =
    "Fred Tucker, 49 years old, was admitted on 02/12/2025 with symptoms of severe abdominal pain and diagnosed with acute appendicitis. Patient underwent successful laparoscopic appendectomy on 02/13/2025. Post-operative course was uncomplicated with good pain control. Discharged on 02/15/2025 with oral antibiotics for 7 days and follow-up appointment scheduled with Dr. Johnson in 2 weeks."

  useEffect(() => {
    if (typeof window === "undefined") return

    if (isOpen) {
      controls.start({
        y: sheetState === "partial" ? initialY : fullY,
        transition: { type: "spring", damping: 30, stiffness: 400 },
      })
    } else {
      controls.start({
        y: window.innerHeight,
        transition: { type: "spring", damping: 30, stiffness: 400 },
      })
    }
  }, [isOpen, sheetState, controls, initialY])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (typeof window === "undefined") return

    const threshold = 100
    const velocity = info.velocity.y
    const offset = info.offset.y

    if (sheetState === "partial") {
      // From partial state
      if (offset < -threshold || velocity < -500) {
        // Swipe up - expand to full
        setSheetState("full")
      } else if (offset > threshold || velocity > 500) {
        // Swipe down - close
        onClose()
      }
    } else {
      // From full state
      if (offset > threshold || velocity > 500) {
        // Swipe down - go to partial or close
        if (info.point.y > window.innerHeight / 2) {
          onClose()
        } else {
          setSheetState("partial")
        }
      }
    }
  }

  // Prevent drag when scrolling content
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (sheetState === "full" && contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      const isAtTop = scrollTop <= 0
      const isAtBottom = scrollTop + clientHeight >= scrollHeight

      // Allow drag only at the top of the content when scrolling up
      // or at the bottom of the content when scrolling down
      if ((isAtTop && info.offset.y > 0) || (isAtBottom && info.offset.y < 0)) {
        return true
      }
      return false
    }
    return true
  }

  if (!appointment) return null

  return (
    <motion.div
      ref={sheetRef}
      initial={{ y: typeof window !== "undefined" ? window.innerHeight : 0 }}
      animate={controls}
      drag="y"
      dragConstraints={{ top: 0, bottom: typeof window !== "undefined" ? window.innerHeight : 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      dragListener={handleDrag}
      className="fixed left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 flex flex-col"
      style={{
        height: sheetState === "partial" ? "400px" : "100vh",
        top: 0,
        bottom: 0,
      }}
    >
      {/* Handle bar - fixed at top */}
      <div className="w-full flex justify-center pt-2 pb-4 sticky top-0 bg-white z-10">
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>
      {/* Scrollable content container */}
      <div ref={contentRef} className={`flex-1 overflow-y-auto ${sheetState === "full" ? "pb-6" : ""}`}>
        {/* Patient info header */}
        <div className="flex items-center px-4 pb-4">
          <div className="relative mr-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
              {appointment.id}
            </div>
            <div className="w-4 h-4 rounded-full bg-primary absolute -bottom-1 left-5"></div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#212121]">{appointment.patientName}</h2>
            <p className="text-[#757575]">{appointment.address}</p>
            <p className="text-[#757575]">(508) 987-6543</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onPrevious}
              className="p-2 text-[#768293] hover:text-[#9AA6B6] disabled:opacity-30"
              disabled={!onPrevious}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={onNext}
              className="p-2 text-[#768293] hover:text-[#9AA6B6] disabled:opacity-30"
              disabled={!onNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4 px-4 mb-4">
          <button className="flex items-center justify-center py-3 px-4 border border-[#768293] rounded-lg text-[#768293]">
            <Navigation2 className="mr-2" size={18} />
            Directions
          </button>
          <button className="flex items-center justify-center py-3 px-4 border border-[#768293] rounded-lg text-[#768293]">
            <Phone className="mr-2" size={18} />
            Call
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4 mb-4">
          <button className="flex items-center justify-center py-3 px-4 bg-[#A1A1AA] rounded-lg text-white">
            <LogIn className="mr-2" size={18} />
            Check In
          </button>
          <button className="flex items-center justify-center py-3 px-4 border border-[#FF5252] rounded-lg text-[#FF5252]">
            <Ban className="mr-2" size={18} />
            Refusal
          </button>
        </div>

        {/* Notes */}
        <div
          className={`px-4 py-3 ${isEditingNote ? "bg-white" : sheetState === "full" ? "bg-[#FFC107]" : "bg-[#F4F5F7]"}`}
        >
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              {isEditingNote ? (
                <div className="flex-1 flex flex-col gap-2">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-[#212121]"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                      onClick={() => setIsEditingNote(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 bg-primary text-white rounded-md text-sm"
                      onClick={() => {
                        setIsEditingNote(false)
                        // Here you would typically save the note to your backend
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-[#212121]">{noteText}</p>
                  {sheetState === "full" && (
                    <button className="text-[#212121]" onClick={() => setIsEditingNote(true)}>
                      <Edit size={18} />
                    </button>
                  )}
                </>
              )}
            </div>
            {sheetState === "full" && !isEditingNote && (
              <p className="text-[#212121] text-sm mt-2">Updated 03/16/2025 at 12:19pm</p>
            )}
          </div>
        </div>

        {/* Orders section */}
        <div className="px-4 py-3 border-t border-[#E5E7EB]">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-[#757575]">ORDERS FOR THIS VISIT</h3>
            <div className="ml-2 w-6 h-6 rounded-full bg-[#4B997B] flex items-center justify-center text-white text-sm">
              2
            </div>
          </div>

          <div className="mt-4 flex items-start">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
              <Wrench className="text-white" size={20} />
            </div>
            <div>
              <h4 className="text-[#757575] uppercase">ADMISSION</h4>
              <p className="text-lg font-medium">Admit to Elara Caring</p>
              <div className="flex items-center mt-1 space-x-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#757575] mr-2"></div>
                  <span className="text-[#757575]">Once</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#757575] mr-2"></div>
                  <span className="text-[#757575]">March 6 2025</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="py-3 px-4 bg-[#F4F5F7] rounded-md mb-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#4B997B] rounded-full mr-2"></div>
                <p className="text-[#212121]">Conduct Admission Visit</p>
              </div>
            </div>
            <div className="py-3 px-4 bg-[#F4F5F7] rounded-md">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#4B997B] rounded-full mr-2"></div>
                <p className="text-[#212121]">Complete OASIS Form</p>
              </div>
            </div>
          </div>
        </div>

        {/* Only show these sections in full view */}
        {sheetState === "full" && (
          <>
            <div className="px-4 py-3 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#757575]">DISCHARGE SUMMARY</h3>
                <div className="w-8 h-8 bg-[#1E88E5] rounded-full flex items-center justify-center text-white">
                  <Wand2 size={16} />
                </div>
              </div>

              <p className="mt-2 text-[#212121]">
                {isTextExpanded ? fullSummary : shortSummary}
                <a
                  href="#"
                  className="text-[#1E88E5] ml-1"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsTextExpanded(!isTextExpanded)
                  }}
                >
                  {isTextExpanded ? "Read less" : "Read more"}
                </a>
              </p>
            </div>

            <div className="px-4 py-3 border-t border-[#E5E7EB]">
              <h3 className="text-lg font-medium text-[#757575]">Referred for</h3>
              <ul className="list-disc pl-5 mt-2">
                <li className="text-[#212121]">Medication</li>
                <li className="text-[#212121]">PT</li>
              </ul>
            </div>
          </>
        )}
      </div>{" "}
      {/* Close the scrollable content container */}
      {/* View Full Patient History button - only shown in full view */}
      {sheetState === "full" && (
        <div className="px-4 py-4 border-t border-[#E5E7EB] bg-white">
          <button
            onClick={() => router.push(`/patients/${appointment.id}`)}
            className="py-3 px-6 bg-primary hover:bg-[#9A68B8] text-white rounded-lg font-medium w-full transition-colors flex items-center justify-center"
          >
            View Full Patient History
          </button>
        </div>
      )}
    </motion.div>
  )
}

