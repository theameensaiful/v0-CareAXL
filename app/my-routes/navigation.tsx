"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { StatusBar } from "../components/status-bar"
import { ArrowLeft, Search, Volume2, Phone, Navigation, AlertTriangle } from "lucide-react"
import { loadGoogleMaps, createFallbackMap } from "../utils/google-maps"

// Declare google variable to avoid undefined errors
declare global {
  interface Window {
    google: any
  }
}

export default function NavigationPage() {
  const router = useRouter()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapLoadError, setMapLoadError] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [currentStep, setCurrentStep] = useState<{
    instruction: string
    distance: string
    maneuver?: string
  }>({ instruction: "Turn Left", distance: "150m" })

  const mapRef = useRef<HTMLDivElement>(null)

  // Sample destination data
  const destination = {
    address: "233 5th Ave Ext, Johnstown NY 12095",
    position: { lat: 46.755, lng: -71.305 },
    travelTime: "15 min",
    distance: "4.4mi",
  }

  // Current position (simulated)
  const currentPosition = { lat: 46.762, lng: -71.295 }

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
        if (mapRef.current) {
          createFallbackMap(mapRef.current)
        }
      })
  }, [])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapLoadError || map) return

    try {
      // Initialize map
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: currentPosition,
        zoom: 17,
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
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapLoadError(true)

      // Create fallback UI if map element exists
      if (mapRef.current) {
        createFallbackMap(mapRef.current)
      }
    }
  }, [mapLoaded, mapLoadError, map])

  // Calculate and display route
  useEffect(() => {
    // Only proceed if map and directions renderer are initialized and route hasn't been calculated yet
    if (!map || !directionsRenderer || mapLoadError) return

    try {
      // Calculate and display route
      const directionsService = new window.google.maps.DirectionsService()

      directionsService.route(
        {
          origin: currentPosition,
          destination: destination.position,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result)

            // Add current location marker with custom icon
            new window.google.maps.Marker({
              position: currentPosition,
              map: map,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: "#1E88E5",
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 10,
              },
              zIndex: 2,
            })

            // Set map to follow current position
            map.setCenter(currentPosition)
          } else {
            console.error("Directions request failed:", status)
          }
        },
      )
    } catch (error) {
      console.error("Error calculating route:", error)
    }
  }, [map, directionsRenderer, mapLoadError, destination.position])

  // Simulate GPS updates
  useEffect(() => {
    if (!map || mapLoadError) return

    // Simulate GPS updates
    const intervalId = setInterval(() => {
      // This would be replaced with actual GPS data in a real app
      const newPosition = {
        lat: currentPosition.lat + (Math.random() - 0.5) * 0.0005,
        lng: currentPosition.lng + (Math.random() - 0.5) * 0.0005,
      }

      if (map) {
        map.setCenter(newPosition)
      }
    }, 3000)

    return () => clearInterval(intervalId)
  }, [map, mapLoadError])

  const handleExitRoute = () => {
    router.push("/my-routes")
  }

  const handleReCenter = () => {
    if (map) {
      map.setCenter(currentPosition)
      map.setZoom(17)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <StatusBar />

      {/* Navigation header */}
      <div className="bg-[#4B997B] text-white py-3 px-4 flex items-center justify-between z-10">
        <div className="flex items-center">
          <ArrowLeft size={24} className="mr-3" />
          <span className="text-xl font-medium">{currentStep.instruction}</span>
        </div>
        <span className="text-xl font-medium">{currentStep.distance}</span>
      </div>

      {/* Map */}
      <div className="relative flex-1">
        <div ref={mapRef} className="w-full h-full"></div>

        {/* Error overlay */}
        {mapLoadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-20">
            <AlertTriangle size={48} className="text-amber-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load map</h3>
            <p className="text-gray-600 text-center px-4 mb-4">
              There was an issue loading the map. Please check your internet connection.
            </p>
            <button onClick={handleExitRoute} className="px-4 py-2 bg-[#7B4B99] text-white rounded-md">
              Go Back
            </button>
          </div>
        )}

        {/* Map controls - only show if map loaded successfully */}
        {!mapLoadError && (
          <div className="absolute top-4 right-4 flex flex-col space-y-3 z-10">
            <button className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-[#768293]">
              <Search size={20} />
            </button>
            <button className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-[#768293]">
              <Volume2 size={20} />
            </button>
            <button className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-[#768293]">
              <Phone size={20} />
            </button>
          </div>
        )}

        {/* Re-center button - only show if map loaded successfully */}
        {!mapLoadError && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10">
            <button
              onClick={handleReCenter}
              className="px-6 py-2 bg-white rounded-full shadow-md flex items-center justify-center text-[#1E88E5] font-medium"
            >
              <Navigation className="mr-2" size={18} />
              Re-centre
            </button>
          </div>
        )}
      </div>

      {/* Bottom panel */}
      <div className="bg-white border-t border-[#E5E7EB] p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[#757575]">{destination.address}</p>
            <div className="flex items-center mt-1">
              <span className="text-[#4B997B] text-xl font-medium">{destination.travelTime}</span>
              <span className="text-[#757575] ml-4">{destination.distance}</span>
            </div>
          </div>
          <button onClick={handleExitRoute} className="px-5 py-3 bg-[#FF5252] text-white font-medium rounded-full">
            Exit route
          </button>
        </div>
      </div>
    </div>
  )
}

