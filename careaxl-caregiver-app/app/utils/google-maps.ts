import { Loader } from "@googlemaps/js-api-loader"

// Update the getGoogleMapsLoader function to fetch the API key from the server

// Define all libraries we'll need across the app
// Note: 'directions' is not a valid library name, we should use 'routes' instead
const LIBRARIES = ["places", "routes", "geometry"]

// Create a singleton loader instance
let loaderInstance: Loader | null = null
let loadPromise: Promise<typeof google> | null = null

export async function getGoogleMapsLoader(): Promise<Loader> {
  if (!loaderInstance) {
    // Fetch API key from server
    let apiKey = ""
    try {
      const response = await fetch("/api/maps")
      const data = await response.json()
      apiKey = data.apiKey
    } catch (error) {
      console.error("Failed to fetch Google Maps API key:", error)
    }

    // Log warning if API key is missing
    if (!apiKey) {
      console.warn("Google Maps API key is missing. Map functionality will be limited.")
    }

    loaderInstance = new Loader({
      apiKey,
      version: "weekly",
      libraries: LIBRARIES,
      retries: 3,
      language: "en",
    })
  }
  return loaderInstance
}

// Helper function to load Google Maps and return a promise
export async function loadGoogleMaps(): Promise<typeof google> {
  if (!loadPromise) {
    loadPromise = new Promise(async (resolve, reject) => {
      try {
        // Check if we're in a browser environment
        if (typeof window === "undefined") {
          reject(new Error("Cannot load Google Maps in a server environment"))
          return
        }

        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          console.log("Google Maps already loaded, using existing instance")
          resolve(window.google)
          return
        }

        // Load Google Maps
        const loader = await getGoogleMapsLoader()
        loader
          .load()
          .then((google) => {
            console.log("Google Maps loaded successfully")
            resolve(google)
          })
          .catch((error) => {
            console.error("Error loading Google Maps:", error)
            reject(error)
          })
      } catch (error) {
        console.error("Exception while loading Google Maps:", error)
        reject(error)
      }
    })
  }

  return loadPromise
}

// Function to create a fallback map when Google Maps fails to load
export function createFallbackMap(element: HTMLElement): void {
  // Check if we're in a browser environment
  if (typeof window === "undefined" || !element) return

  // Create a simple fallback UI
  element.innerHTML = `
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f0f0f0;">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#7B4B99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p style="margin-top: 16px; font-size: 16px; color: #333; text-align: center;">Unable to load map.<br>Please check your internet connection.</p>
    </div>
  `
}

// Type declaration for global google object
declare global {
  interface Window {
    google: any
  }
}

