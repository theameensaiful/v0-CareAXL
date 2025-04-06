"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  FileText,
  Navigation2,
  Phone,
  Ban,
  LogIn,
  Wand2,
  ChevronRight,
  ChevronDown,
  Edit,
  Folder,
} from "lucide-react"
import { StatusBar } from "../../components/status-bar"

interface Patient {
  id: number
  name: string
  gender: string
  dateOfBirth: string
  appointmentTime?: string
  image?: string
  initials?: string
  status?: "Active" | "Completed" | "Inactive"
  address?: string
  phone?: string
  notes?: string
  dischargeSummary?: string
  treatments?: {
    type: string
    name: string
    frequency?: string
    duration?: string
    expanded?: boolean
  }[]
  pastEpisodes?: {
    date: string
    id: number
    orders?: {
      type: string
      name: string
      frequency?: string
      duration?: string
      expanded?: boolean
      directives?: string[]
    }[]
  }[]
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [activeTab, setActiveTab] = useState<"current" | "past">("current")
  const [isTextExpanded, setIsTextExpanded] = useState(false)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [expandedEpisodeId, setExpandedEpisodeId] = useState<number | null>(null)

  // Sample patient data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call to get patient data
    const patientData: Patient = {
      id: Number.parseInt(params.id),
      name: "Fred Tucker",
      gender: "Male",
      dateOfBirth: "12/12/1970 (58yrs)",
      appointmentTime: "09:30am",
      initials: "FT",
      address: "100 Elm Ridge Center Dr, Greece NY 14626",
      phone: "(508) 987-6543",
      notes: "", // Start with empty notes
      dischargeSummary:
        "Fred Tucker, 49 years old, was admitted on 02/12/2025 with symptoms of severe abdominal pain and diagnosed with acute appendicitis. Patient underwent successful laparoscopic appendectomy on 02/13/2025. Post-operative course was uncomplicated with good pain control. Discharged on 02/15/2025 with oral antibiotics for 7 days and follow-up appointment scheduled with Dr. Johnson in 2 weeks.",
      treatments: [
        {
          type: "ADMISSION",
          name: "Admit to Elara Caring",
          frequency: "Once",
          expanded: false,
        },
        {
          type: "MEDICATION",
          name: "Wound care treatment",
          frequency: "3x/week",
          duration: "3 weeks",
          expanded: false,
        },
        {
          type: "OBSERVATION",
          name: "Check wound healing status",
          frequency: "Daily",
          duration: "1 week",
          expanded: false,
        },
      ],
      pastEpisodes: [
        {
          date: "March 7, 2025",
          id: 1,
          orders: [
            {
              type: "MEDICATION",
              name: "Antibiotic treatment",
              frequency: "2x/day",
              duration: "7 days",
              expanded: false,
              directives: ["Administer with food", "Monitor for allergic reactions"],
            },
            {
              type: "OBSERVATION",
              name: "Check vital signs",
              frequency: "Daily",
              duration: "3 days",
              expanded: false,
              directives: ["Record temperature, pulse, and blood pressure", "Report abnormal readings"],
            },
          ],
        },
        {
          date: "March 1, 2025",
          id: 2,
          orders: [
            {
              type: "ASSESSMENT",
              name: "Comprehensive evaluation",
              frequency: "Once",
              expanded: false,
              directives: ["Complete all assessment forms", "Document findings in detail"],
            },
            {
              type: "MEDICATION",
              name: "Pain management",
              frequency: "As needed",
              duration: "5 days",
              expanded: false,
              directives: ["Administer only if pain level > 4", "Maximum 4 doses per day"],
            },
          ],
        },
        {
          date: "February 28, 2025",
          id: 3,
          orders: [
            {
              type: "PROCEDURE",
              name: "Wound dressing change",
              frequency: "Daily",
              duration: "10 days",
              expanded: false,
              directives: ["Use sterile technique", "Document wound appearance", "Apply prescribed ointment"],
            },
          ],
        },
        {
          date: "February 21, 2025",
          id: 4,
          orders: [
            {
              type: "MEDICATION",
              name: "IV antibiotics",
              frequency: "3x/day",
              duration: "5 days",
              expanded: false,
              directives: ["Administer over 30 minutes", "Monitor IV site for inflammation"],
            },
            {
              type: "OBSERVATION",
              name: "Monitor temperature",
              frequency: "Every 4 hours",
              duration: "48 hours",
              expanded: false,
              directives: ["Record in patient chart", "Alert physician if > 101°F"],
            },
          ],
        },
      ],
    }

    setPatient(patientData)
    if (patientData.notes) {
      setNoteText(patientData.notes)
      setLastUpdated("03/16/2025 at 12:19pm") // Sample timestamp
    }
  }, [params.id])

  if (!patient) {
    return <div>Loading...</div>
  }

  const shortSummary = patient.dischargeSummary?.substring(0, 70) + "..."

  const handleBack = () => {
    router.push("/patients")
  }

  const toggleTreatment = (index: number) => {
    if (!patient || !patient.treatments) return

    const updatedTreatments = [...patient.treatments]
    updatedTreatments[index].expanded = !updatedTreatments[index].expanded

    setPatient({
      ...patient,
      treatments: updatedTreatments,
    })
  }

  const handleSaveNote = () => {
    // In a real app, you would save this to your backend
    setIsEditingNote(false)

    // Update the timestamp
    const now = new Date()
    const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} at ${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, "0")}${now.getHours() >= 12 ? "pm" : "am"}`
    setLastUpdated(formattedDate)

    // Update the patient object
    if (patient) {
      setPatient({
        ...patient,
        notes: noteText,
      })
    }
  }

  const handleEpisodeClick = (episodeId: number) => {
    // If clicking the same episode that's already expanded, close it
    if (expandedEpisodeId === episodeId) {
      setExpandedEpisodeId(null)
    } else {
      // Otherwise, expand the clicked episode (which automatically closes any other)
      setExpandedEpisodeId(episodeId)
    }
  }

  const toggleOrder = (episodeId: number, orderIndex: number) => {
    if (!patient || !patient.pastEpisodes) return

    const episodeIndex = patient.pastEpisodes.findIndex((ep) => ep.id === episodeId)
    if (episodeIndex === -1) return

    const updatedEpisodes = [...patient.pastEpisodes]
    const updatedOrders = [...(updatedEpisodes[episodeIndex].orders || [])]

    // Toggle the expanded state
    updatedOrders[orderIndex] = {
      ...updatedOrders[orderIndex],
      expanded: !updatedOrders[orderIndex].expanded,
    }

    updatedEpisodes[episodeIndex] = {
      ...updatedEpisodes[episodeIndex],
      orders: updatedOrders,
    }

    setPatient({
      ...patient,
      pastEpisodes: updatedEpisodes,
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <StatusBar />
      {/* Header */}
      <header className="px-4 py-3 flex items-center border-b border-[#E5E7EB]">
        <button onClick={handleBack} className="mr-4 text-[#768293]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-[#212121]">{patient.name}&apos;s Profile</h1>
      </header>
      {/* Patient Info */}
      <div className="p-4 flex items-center">
        <div className="relative mr-4">
          {patient.image ? (
            <img
              src={patient.image || "/placeholder.svg"}
              alt={patient.name}
              className="w-20 h-20 rounded-full object-cover border border-gray-200"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#757575] text-3xl font-bold">
              {patient.initials}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#212121]">{patient.name}</h2>
          <div className="flex items-center mt-1">
            <span className="text-[#757575] text-base">{patient.dateOfBirth}</span>
            <span className="ml-3 px-3 py-1 bg-[#F3E5FF] text-primary rounded-full text-sm">{patient.gender}</span>
          </div>
        </div>
      </div>
      {/* Address and Phone */}
      <div className="px-4 pb-3">
        <p className="text-[#757575] text-base">{patient.address}</p>
        <p className="text-[#757575] text-base mt-1">{patient.phone}</p>
      </div>
      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-3 px-4 mb-4">
        <button className="flex items-center justify-center py-3 px-2 border border-[#4B997B] rounded-lg text-[#4B997B]">
          <FileText className="mr-2" size={18} />
          <span className="text-xs font-medium">Patient file</span>
        </button>
        <button className="flex items-center justify-center py-3 px-2 border border-[#768293] rounded-lg text-[#768293]">
          <Navigation2 className="mr-2" size={18} />
          <span className="text-xs font-medium">Directions</span>
        </button>
        <button className="flex items-center justify-center py-3 px-2 border border-[#768293] rounded-lg text-[#768293]">
          <Phone className="mr-2" size={18} />
          <span className="text-xs font-medium">Call</span>
        </button>
      </div>
      {/* Notes */}
      <div
        className={`px-4 py-3 border-t border-b border-[#E5E7EB] ${!isEditingNote && noteText ? "bg-[#FFC107]" : ""}`}
      >
        {isEditingNote ? (
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-[#212121]"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              autoFocus
              placeholder="Enter notes here..."
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                onClick={() => setIsEditingNote(false)}
              >
                Cancel
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded-md text-sm" onClick={handleSaveNote}>
                Save
              </button>
            </div>
          </div>
        ) : noteText ? (
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[#212121]">{noteText}</p>
              <button className="text-[#212121]" onClick={() => setIsEditingNote(true)}>
                <Edit size={18} />
              </button>
            </div>
            {lastUpdated && <p className="text-[#212121] text-sm mt-2">Updated {lastUpdated}</p>}
          </div>
        ) : (
          <div className="text-[#9A68B8] font-medium text-base cursor-pointer" onClick={() => setIsEditingNote(true)}>
            Add notes
          </div>
        )}
      </div>
      {/* Discharge Summary */}
      <div className="px-4 py-3 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-[#757575]">DISCHARGE SUMMARY</h3>
          <div className="w-8 h-8 bg-[#1E88E5] rounded-full flex items-center justify-center text-white">
            <Wand2 size={16} />
          </div>
        </div>

        <p className="mt-2 text-[#212121] text-sm">
          {isTextExpanded ? patient.dischargeSummary : shortSummary}
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
      {/* Episode Tabs */}
      <div className="flex border-b border-[#E5E7EB]">
        <button
          className={`flex-1 py-3 px-4 text-base font-medium relative flex items-center justify-center ${
            activeTab === "current" ? "text-[#9A68B8]" : "text-[#757575]"
          }`}
          onClick={() => setActiveTab("current")}
        >
          <div className="w-6 h-6 bg-[#9A68B8] rounded-md flex items-center justify-center text-white mr-2">
            <FileText size={14} />
          </div>
          Current Episode
          {activeTab === "current" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#9A68B8]"></div>}
        </button>
        <button
          className={`flex-1 py-3 px-4 text-base font-medium relative flex items-center justify-center ${
            activeTab === "past" ? "text-[#9A68B8]" : "text-[#757575]"
          }`}
          onClick={() => setActiveTab("past")}
        >
          <div className="w-6 h-6 bg-[#768293] rounded-md flex items-center justify-center text-white mr-2">
            <FileText size={14} />
          </div>
          Past Episodes
          {activeTab === "past" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#9A68B8]"></div>}
        </button>
      </div>
      {/* Conditional Content Based on Active Tab */}
      {activeTab === "current" ? (
        <>
          {/* Date */}
          <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center">
            <div className="w-6 h-6 bg-[#768293] rounded-md flex items-center justify-center text-white mr-2">
              <FileText size={14} />
            </div>
            <span className="text-base font-medium text-[#757575]">March 16, 2025</span>
          </div>

          {/* Treatments */}
          <div>
            {patient.treatments?.map((treatment, index) => (
              <div key={index} className="border-b border-[#E5E7EB]">
                <div className="px-4 py-3">
                  <div className="text-xs text-[#757575] uppercase">{treatment.type}</div>
                  <div
                    className="flex items-center justify-between mt-1 cursor-pointer"
                    onClick={() => toggleTreatment(index)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#9A68B8] rounded-lg flex items-center justify-center mr-3">
                        <FileText className="text-white" size={20} />
                      </div>
                      <span className="text-base font-medium">{treatment.name}</span>
                    </div>
                    {treatment.expanded ? (
                      <ChevronDown size={20} className="text-[#757575]" />
                    ) : (
                      <ChevronRight size={20} className="text-[#757575]" />
                    )}
                  </div>

                  <div className="flex items-center mt-2 ml-13 space-x-4 pl-13">
                    <div className="flex items-center ml-13">
                      <div className="w-2 h-2 rounded-full bg-[#757575] mr-2"></div>
                      <span className="text-xs text-[#757575]">{treatment.frequency}</span>
                    </div>
                    {treatment.duration && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[#757575] mr-2"></div>
                        <span className="text-xs text-[#757575]">{treatment.duration}</span>
                      </div>
                    )}
                  </div>

                  {treatment.expanded && (
                    <div className="mt-3 ml-13 pl-13">
                      <div className="py-3 px-4 bg-[#F4F5F7] rounded-md mb-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-[#4B997B] rounded-full mr-2"></div>
                          <p className="text-[#212121] text-sm">Complete assessment</p>
                        </div>
                      </div>
                      <div className="py-3 px-4 bg-[#F4F5F7] rounded-md">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-[#4B997B] rounded-full mr-2"></div>
                          <p className="text-[#212121] text-sm">Document findings</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Past Episodes Tab Content */
        <div>
          {patient.pastEpisodes?.map((episode) => (
            <div key={episode.id}>
              <div
                className="px-4 py-4 border-b border-[#E5E7EB] flex items-center justify-between cursor-pointer"
                onClick={() => handleEpisodeClick(episode.id)}
              >
                <div className="flex items-center">
                  <Folder className="text-[#768293] mr-3" size={22} />
                  <span className="text-base font-medium text-[#212121]">{episode.date}</span>
                </div>
                {expandedEpisodeId === episode.id ? (
                  <ChevronDown className="text-[#768293]" size={20} />
                ) : (
                  <ChevronRight className="text-[#768293]" size={20} />
                )}
              </div>

              {/* Expanded content - only shown when this episode is expanded */}
              {expandedEpisodeId === episode.id && episode.orders && (
                <div className="bg-white">
                  {episode.orders.map((order, orderIndex) => (
                    <div key={orderIndex} className="border-b border-[#E5E7EB]">
                      <div className="px-4 py-3">
                        <div className="text-xs text-[#757575] uppercase">{order.type}</div>
                        <div
                          className="flex items-center justify-between mt-1 cursor-pointer"
                          onClick={() => toggleOrder(episode.id, orderIndex)}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#9A68B8] rounded-lg flex items-center justify-center mr-3">
                              <FileText className="text-white" size={20} />
                            </div>
                            <span className="text-base font-medium">{order.name}</span>
                          </div>
                          {order.expanded ? (
                            <ChevronDown size={20} className="text-[#757575]" />
                          ) : (
                            <ChevronRight size={20} className="text-[#757575]" />
                          )}
                        </div>

                        <div className="flex items-center mt-2 ml-13 space-x-4 pl-13">
                          <div className="flex items-center ml-13">
                            <div className="w-2 h-2 rounded-full bg-[#757575] mr-2"></div>
                            <span className="text-xs text-[#757575]">{order.frequency}</span>
                          </div>
                          {order.duration && (
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-[#757575] mr-2"></div>
                              <span className="text-xs text-[#757575]">{order.duration}</span>
                            </div>
                          )}
                        </div>

                        {order.expanded && order.directives && (
                          <div className="mt-3 ml-13 pl-13">
                            {order.directives.map((directive, i) => (
                              <div key={i} className="py-3 px-4 bg-[#F4F5F7] rounded-md mb-2 last:mb-0">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-[#4B997B] rounded-full mr-2"></div>
                                  <p className="text-[#212121] text-sm">{directive}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Bottom Action Buttons - Fixed at bottom */};
      <div className="fixed bottom-0 left-0 right-0 grid grid-cols-2 gap-4 p-4 border-t border-[#E5E7EB] bg-white shadow-md">
        <button className="flex items-center justify-center py-3 px-4 border border-[#FF5252] rounded-lg text-[#FF5252]">
          <Ban className="mr-2" size={18} />
          Refusal
        </button>
        <button className="flex items-center justify-center py-3 px-4 bg-[#A1A1AA] rounded-lg text-white">
          <LogIn className="mr-2" size={18} />
          Check In
        </button>
      </div>
    </div>
  )
}

