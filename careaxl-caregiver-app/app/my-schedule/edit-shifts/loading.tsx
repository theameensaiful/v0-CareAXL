export default function Loading() {
  return (
    <div className="flex flex-col h-screen bg-white items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      <p className="mt-4 text-primary">Loading...</p>
    </div>
  )
}

