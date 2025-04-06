import { Battery, Signal, Wifi } from "lucide-react"

export function StatusBar() {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white">
      <div className="text-[#212121] font-medium">9:41</div>
      <div className="flex items-center gap-1">
        <Signal size={16} className="text-[#212121]" />
        <Wifi size={16} className="text-[#212121]" />
        <Battery size={16} className="text-[#212121]" />
      </div>
    </div>
  )
}

