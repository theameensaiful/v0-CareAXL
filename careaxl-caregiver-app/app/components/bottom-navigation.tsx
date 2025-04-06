import Link from "next/link"
import { Home, MapPin, User, Calendar } from "lucide-react"

interface BottomNavigationProps {
  currentRoute: "home" | "my-routes" | "patients" | "my-schedule"
}

export function BottomNavigation({ currentRoute }: BottomNavigationProps) {
  return (
    <nav className="flex items-center justify-around bg-white border-t border-[#E5E7EB] py-2">
      <Link
        href="/home"
        className={`flex flex-col items-center p-2 ${currentRoute === "home" ? "text-[#7B4B99]" : "text-[#768293]"}`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </Link>

      <Link
        href="/my-routes"
        className={`flex flex-col items-center p-2 ${currentRoute === "my-routes" ? "text-[#7B4B99]" : "text-[#768293]"}`}
      >
        <MapPin size={24} />
        <span className="text-xs mt-1">My Routes</span>
      </Link>

      <Link
        href="/patients"
        className={`flex flex-col items-center p-2 ${currentRoute === "patients" ? "text-[#7B4B99]" : "text-[#768293]"}`}
      >
        <User size={24} />
        <span className="text-xs mt-1">Patients</span>
      </Link>

      <Link
        href="/my-schedule"
        className={`flex flex-col items-center p-2 ${currentRoute === "my-schedule" ? "text-[#7B4B99]" : "text-[#768293]"}`}
      >
        <Calendar size={24} />
        <span className="text-xs mt-1">My Schedule</span>
      </Link>
    </nav>
  )
}

