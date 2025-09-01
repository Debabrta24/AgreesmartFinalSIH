import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Google Maps TypeScript declarations
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      addListener(eventName: string, handler: Function): void;
    }
    class Marker {
      constructor(opts?: MarkerOptions);
      addListener(eventName: string, handler: Function): void;
    }
    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: Marker): void;
    }
    class Geocoder {
      constructor();
      geocode(request: GeocoderRequest): Promise<GeocoderResponse>;
    }
    interface MapOptions {
      center: LatLng | LatLngLiteral;
      zoom: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }
    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map: Map;
      title?: string;
    }
    interface InfoWindowOptions {
      content: string;
    }
    interface LatLng {
      lat(): number;
      lng(): number;
    }
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    interface MapMouseEvent {
      latLng: LatLng | null;
    }
    interface GeocoderRequest {
      location: LatLng;
    }
    interface GeocoderResponse {
      results: Array<{
        formatted_address: string;
      }>;
    }
  }
}

interface GoogleMapsProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    info?: string;
  }>;
}

export default function GoogleMaps({ 
  center = { lat: 20.5937, lng: 78.9629 }, // Default to India
  zoom = 6,
  height = "400px",
  onLocationSelect,
  markers = []
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: "demo", // Using demo key - replace with real Google Maps API key
          version: "weekly",
          libraries: ["places"]
        });

        await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          });

          setMap(mapInstance);
          setIsLoaded(true);

          // Add click handler for location selection
          if (onLocationSelect) {
            mapInstance.addListener('click', async (event: google.maps.MapMouseEvent) => {
              if (event.latLng) {
                const geocoder = new google.maps.Geocoder();
                try {
                  const response = await geocoder.geocode({
                    location: event.latLng
                  });
                  
                  const address = response.results[0]?.formatted_address || "Unknown location";
                  onLocationSelect({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                    address
                  });
                } catch (err) {
                  console.error('Geocoding failed:', err);
                  onLocationSelect({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                    address: "Location selected"
                  });
                }
              }
            });
          }

          // Add markers
          markers.forEach(marker => {
            const mapMarker = new google.maps.Marker({
              position: marker.position,
              map: mapInstance,
              title: marker.title
            });

            if (marker.info) {
              const infoWindow = new google.maps.InfoWindow({
                content: marker.info
              });

              mapMarker.addListener('click', () => {
                infoWindow.open(mapInstance, mapMarker);
              });
            }
          });
        }
      } catch (err) {
        console.error('Failed to load Google Maps:', err);
        setError('Failed to load map. Using fallback agricultural data.');
        setIsLoaded(false);
      }
    };

    initMap();
  }, [center, zoom, onLocationSelect, markers]);

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-green-50 border-2 border-dashed border-green-200 rounded-lg"
        style={{ height }}
        data-testid="maps-fallback"
      >
        <div className="text-center p-4">
          <div className="text-green-600 mb-2">🗺️ Map Integration Available</div>
          <p className="text-sm text-gray-600 mb-3">{error}</p>
          <div className="bg-white p-3 rounded border">
            <p className="text-xs text-gray-500">
              Agricultural data is available for all regions of India.
              Click "Get Recommendations" to continue with location-based farming advice.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200"
        data-testid="google-maps-container"
      />
      {!isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg"
          data-testid="maps-loading"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}