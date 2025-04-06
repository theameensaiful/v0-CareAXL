"use client"

import { useEffect, useRef, useState } from "react"
import { BottomSheet } from "../components/bottom-sheet"
import { MapPin, ZoomIn, ZoomOut, Locate, Layers, AlertTriangle } from "lucide-react"
import { loadGoogleMaps, createFallbackMap } from "../utils/google-maps"

interface Appointment {
  id: number
  status: "completed" | "next" | "upcoming" | "cancelled"
  patientName: string
  address: string
  time: string
  treatment: string
  position: {
    lat: number
    lng: number
  }
}

interface MapComponentProps {
  appointments: Appointment[]
}

export default function MapComponent({ appointments }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [polylines, setPolylines] = useState<google.maps.Polyline[]>([])
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false)
  const [mapLoadError, setMapLoadError] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null)

  useEffect(() => {
    // Load Google Maps using our shared utility
    loadGoogleMaps()
      .then(() => {
        setGoogleMapsLoaded(true)
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
    if (!googleMapsLoaded || !mapRef.current || map) return
    if (!window.google || !window.google.maps) {
      console.error("Google Maps not loaded yet")
      setMapLoadError(true)
      if (mapRef.current) {
        createFallbackMap(mapRef.current)
      }
      return
    }

    try {
      // Find the center point based on appointments
      const bounds = new window.google.maps.LatLngBounds()
      appointments.forEach((app) => {
        bounds.extend(new window.google.maps.LatLng(app.position.lat, app.position.lng))
      })

      const newMap = new window.google.maps.Map(mapRef.current, {
        center: bounds.getCenter(),
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

      newMap.fitBounds(bounds)
      setMap(newMap)
      setMapBounds(bounds)
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapLoadError(true)
      if (mapRef.current) {
        createFallbackMap(mapRef.current)
      }
    }
  }, [googleMapsLoaded, mapRef, map, appointments])

  useEffect(() => {
    if (!map || !googleMapsLoaded || mapLoadError) return
    if (!window.google || !window.google.maps) return

    try {
      // Clear existing markers and polylines
      markers.forEach((marker) => marker.setMap(null))
      polylines.forEach((polyline) => polyline.setMap(null))

      const newMarkers: google.maps.Marker[] = []
      const newPolylines: google.maps.Polyline[] = []

      // Create markers for each appointment
      appointments.forEach((app) => {
        let iconUrl = ""
        const labelContent = app.id.toString()

        switch (app.status) {
          case "completed":
            iconUrl = "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            break
          case "next":
            iconUrl = "https://maps.google.com/mapfiles/ms/icons/purple-dot.png"
            break
          case "upcoming":
            // Custom SVG for purple outlined pin
            const svgMarker = {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "white",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#7B4B99",
              scale: 10,
            }

            const marker = new window.google.maps.Marker({
              position: app.position,
              map,
              icon: svgMarker,
              label: {
                text: labelContent,
                color: "#7B4B99",
                fontWeight: "bold",
              },
              zIndex: 1,
            })

            // Add click event to marker
            marker.addListener("click", () => {
              setSelectedAppointment(app)
              setIsBottomSheetOpen(true)
            })

            newMarkers.push(marker)
            return

          case "cancelled":
            iconUrl = "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            break
        }

        const marker = new window.google.maps.Marker({
          position: app.position,
          map,
          icon: iconUrl,
          label:
            app.status !== "completed"
              ? {
                  text: labelContent,
                  color: "white",
                  fontWeight: "bold",
                }
              : {
                  text: "✓",
                  color: "white",
                  fontWeight: "bold",
                },
          zIndex: app.status === "next" ? 2 : 1,
        })

        // Add click event to marker
        marker.addListener("click", () => {
          setSelectedAppointment(app)
          setIsBottomSheetOpen(true)
        })

        newMarkers.push(marker)
      })

      // Create routes between appointments
      const nextAppointment = appointments.find((app) => app.status === "next")
      const completedAppointment = appointments.find((app) => app.status === "completed")
      const upcomingAppointments = appointments.filter((app) => app.status === "upcoming")

      // Create solid purple line for next appointment route
      if (nextAppointment && completedAppointment) {
        const nextRoute = new window.google.maps.Polyline({
          path: [completedAppointment.position, nextAppointment.position],
          geodesic: true,
          strokeColor: "#7B4B99",
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map,
        })

        newPolylines.push(nextRoute)
      }

      // Create dashed grey lines for subsequent appointment routes
      if (nextAppointment) {
        let previousPosition = nextAppointment.position

        // Sort upcoming appointments by ID to maintain order
        const sortedUpcoming = [...upcomingAppointments].sort((a, b) => a.id - b.id)

        sortedUpcoming.forEach((app) => {
          const upcomingRoute = new window.google.maps.Polyline({
            path: [previousPosition, app.position],
            geodesic: true,
            strokeColor: "#768293",
            strokeOpacity: 0.7,
            strokeWeight: 3,
            strokePattern: [10, 5],
            map,
          })

          newPolylines.push(upcomingRoute)
          previousPosition = app.position
        })
      }

      setMarkers(newMarkers)
      setPolylines(newPolylines)

      return () => {
        newMarkers.forEach((marker) => marker.setMap(null))
        newPolylines.forEach((polyline) => polyline.setMap(null))
      }
    } catch (error) {
      console.error("Error creating map markers and routes:", error)
    }
  }, [map, googleMapsLoaded, appointments, mapLoadError])

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false)
  }

  const handlePreviousAppointment = () => {
    if (!selectedAppointment) return

    const currentIndex = appointments.findIndex((app) => app.id === selectedAppointment.id)
    if (currentIndex > 0) {
      setSelectedAppointment(appointments[currentIndex - 1])
    }
  }

  const handleNextAppointment = () => {
    if (!selectedAppointment) return

    const currentIndex = appointments.findIndex((app) => app.id === selectedAppointment.id)
    if (currentIndex < appointments.length - 1) {
      setSelectedAppointment(appointments[currentIndex + 1])
    }
  }

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 14
      map.setZoom(currentZoom + 1)
    }
  }

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 14
      map.setZoom(currentZoom - 1)
    }
  }

  const handleCenterOnRoutes = () => {
    if (map && mapBounds) {
      map.fitBounds(mapBounds)
    }
  }

  const handleCurrentLocation = () => {
    if (map && mapBounds) {
      if (navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (window.google && window.google.maps) {
                const currentLocation = new window.google.maps.LatLng(
                  position.coords.latitude,
                  position.coords.longitude,
                )
                map.setCenter(currentLocation)
                map.setZoom(15)
              }
            },
            (error) => {
              console.log("Geolocation error:", error.message)
              // Fallback: Use the center of the route
              map.setCenter(mapBounds.getCenter())
              map.setZoom(14)

              // Show a message to the user
              alert("Unable to access your location. Using route center instead.")
            },
            { timeout: 5000, enableHighAccuracy: false },
          )
        } catch (e) {
          console.log("Geolocation exception:", e)
          // Fallback for any other errors
          map.setCenter(mapBounds.getCenter())
          map.setZoom(14)
        }
      } else {
        // Browser doesn't support geolocation
        map.setCenter(mapBounds.getCenter())
        map.setZoom(14)
        alert("Location services are not available in this browser.")
      }
    } else {
      // Map or mapBounds not available
      alert("Map is not fully loaded yet. Please try again in a moment.")
    }
  }

  return (
    <>
      <div ref={mapRef} className="w-full h-full relative">
        {mapLoadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
            <AlertTriangle size={48} className="text-amber-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load map</h3>
            <p className="text-gray-600 text-center px-4">
              There was an issue loading the map. Please check your internet connection and try again.
            </p>
          </div>
        )}
      </div>

      {/* Map Controls - only show if map loaded successfully */}
      {!mapLoadError && (
        <div className="absolute top-1/4 right-4 flex flex-col space-y-2 z-10">
          <button
            onClick={handleCenterOnRoutes}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-gray-100"
            aria-label="Center on routes"
          >
            <MapPin size={20} />
          </button>
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#768293] hover:bg-gray-100"
            aria-label="Zoom in"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#768293] hover:bg-gray-100"
            aria-label="Zoom out"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleCurrentLocation}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#768293] hover:bg-gray-100"
            aria-label="Current location"
            title="Center on current location (may not work in all environments)"
          >
            <Locate size={20} />
          </button>
          <button
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#768293] hover:bg-gray-100"
            aria-label="Map layers"
          >
            <Layers size={20} />
          </button>
        </div>
      )}

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleCloseBottomSheet}
        appointment={selectedAppointment}
        onPrevious={handlePreviousAppointment}
        onNext={handleNextAppointment}
      />
    </>
  )
}

