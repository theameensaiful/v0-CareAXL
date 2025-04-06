"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { StatusBar } from "../components/status-bar"
import { ChevronLeft, Layers, Navigation, Car, PersonStanding, Bike } from "lucide-react"
import { loadGoogleMaps, createFallbackMap } from "../utils/google-maps"

declare global {
  interface Window {
    google: any
  }
}

export default function RoutePlanningPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [mapLoadError, setMapLoadError] = useState(false)

  // Sample appointment data
  const appointment = {
    patientName: "Fred Tucker",
    address: "100 Elm Ridge Center Dr, Greece NY 14626",
    position: { lat: 46.762, lng: -71.295 },
    travelTime: "15 min",
    distance: "4.4mi",
    appointmentTime: "12:00 pm",
  }

  // Current position (simulated)
  const currentPosition = { lat: 46.769, lng: -71.282 }

  useEffect(() => {
    // Load Google Maps using our utility function that fetches the API key securely
    loadGoogleMaps()
      .then(() => {
        setMapLoaded(true)
        setMapLoadError(false)
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error)
        setMapLoadError(true)

        // Create fallback UI if map element exists
        const mapElement = document.getElementById("map")
        if (mapElement) {
          createFallbackMap(mapElement)
        }
      })

    // Simulate finding the best route with a loading animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!mapLoaded || mapLoadError) return

    // Initialize map
    const mapElement = document.getElementById("map")
    if (!mapElement) return

    try {
      const mapInstance = new window.google.maps.Map(mapElement, {
        center: currentPosition,
        zoom: 14,
        disableDefaultUI: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      // Initialize directions renderer
      const rendererInstance = new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#1E88E5",
          strokeWeight: 6,
          strokeOpacity: 1.0,
        },
      })

      setMap(mapInstance)
      setDirectionsRenderer(rendererInstance)

      // Calculate and display route
      if (!isLoading) {
        const directionsService = new window.google.maps.DirectionsService()

        directionsService.route(
          {
            origin: currentPosition,
            destination: appointment.position,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK && result) {
              rendererInstance.setDirections(result)

              // Add markers for origin and destination
              new window.google.maps.Marker({
                position: currentPosition,
                map: mapInstance,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: "#FF0000",
                  fillOpacity: 1,
                  strokeWeight: 0,
                  scale: 10,
                },
              })

              // Fit map to show the entire route
              const bounds = new window.google.maps.LatLngBounds()
              bounds.extend(currentPosition)
              bounds.extend(appointment.position)
              mapInstance.fitBounds(bounds)
            } else {
              console.error("Directions request failed:", status)
            }
          },
        )
      }
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapLoadError(true)

      // Create fallback UI if map element exists
      const mapElement = document.getElementById("map")
      if (mapElement) {
        createFallbackMap(mapElement)
      }
    }
  }, [mapLoaded, isLoading, appointment.position, mapLoadError])

  const handleBack = () => {
    router.back()
  }

  const handleStartDriving = () => {
    router.push("/my-routes/navigation")
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <StatusBar />

      {/* Header */}
      <header className="px-4 py-3 flex items-center bg-white z-10">
        <button onClick={handleBack} className="mr-4 text-[#768293]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-[#212121]">Route to {appointment.patientName}</h1>
      </header>

      {/* Map */}
      <div className="relative flex-1">
        <div id="map" className="w-full h-full"></div>

        {/* Loading overlay */}
        {isLoading && !mapLoadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-20">
            <div className="w-16 h-16 border-4 border-[#7B4B99] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-[#212121]">Finding Best Route...</p>
          </div>
        )}

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#768293]">
            <Layers size={20} />
          </button>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="bg-white border-t border-[#E5E7EB] p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#212121]">
              {appointment.travelTime} ({appointment.distance})
            </h2>
            <p className="text-[#757575]">{appointment.address}</p>
          </div>
        </div>

        {/* Travel options */}
        <div className="flex space-x-2 py-2 overflow-x-auto">
          <div className="flex flex-col items-center bg-[#4B997B] text-white px-4 py-2 rounded-lg min-w-[90px]">
            <Car size={24} />
            <span className="text-sm font-medium mt-1">{appointment.travelTime}</span>
          </div>
          <div className="flex flex-col items-center bg-[#F3F4F6] text-[#757575] px-4 py-2 rounded-lg min-w-[90px]">
            <Bike size={24} />
            <span className="text-sm font-medium mt-1">45 min</span>
          </div>
          <div className="flex flex-col items-center bg-[#F3F4F6] text-[#757575] px-4 py-2 rounded-lg min-w-[90px]">
            <PersonStanding size={24} />
            <span className="text-sm font-medium mt-1">1h 20m</span>
          </div>
        </div>

        <p className="text-[#4B997B] font-medium">25 mins left to attend this appointment</p>

        <button
          onClick={handleStartDriving}
          className="w-full py-3 bg-[#1E88E5] hover:bg-[#1976D2] text-white font-medium rounded-full flex items-center justify-center"
        >
          <Navigation className="mr-2" size={20} />
          Start Driving
        </button>
      </div>
    </div>
  )
}

