import React, { useRef, useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Profile } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface MapProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  onSelectProfile?: (profile: Profile) => void;
}

const Map: React.FC<MapProps> = ({
  profiles,
  selectedProfile,
  onSelectProfile,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  // Use the provided API key as default, but still allow user to change it
  const defaultApiKey = "AIzaSyCX-YA-W8cKqeuhA-8lUydFFuwJmHVnV98";
  const [mapApiKey, setMapApiKey] = useState<string>(
    localStorage.getItem("google_maps_key") || defaultApiKey
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);
  const { toast } = useToast();

  // Store API key on component mount if not already set
  useEffect(() => {
    if (!localStorage.getItem("google_maps_key")) {
      localStorage.setItem("google_maps_key", defaultApiKey);
    }
  }, [defaultApiKey]);

  // Handle map API key update
  const handleApiKeyUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setMapApiKey(key);
    localStorage.setItem("google_maps_key", key);
    window.location.reload(); // Reload to apply new API key
  };

  // Handle map load
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  // Update map when selected profile changes
  useEffect(() => {
    if (!mapRef.current || !selectedProfile || !mapLoaded) return;

    const { coordinates } = selectedProfile.address;
    const [lng, lat] = coordinates;

    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);

    // Show info window for selected profile
    setActiveInfoWindow(selectedProfile.id);
  }, [selectedProfile, mapLoaded]);

  // Fit map bounds to show all markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || profiles.length === 0) return;

    if (profiles.length === 1) {
      const [lng, lat] = profiles[0].address.coordinates;
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(14);
      return;
    }

    if (selectedProfile) {
      const [lng, lat] = selectedProfile.address.coordinates;
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(14);
      return;
    }

    // Create bounds that fit all markers
    const bounds = new google.maps.LatLngBounds();
    profiles.forEach((profile) => {
      const [lng, lat] = profile.address.coordinates;
      bounds.extend({ lat, lng });
    });

    // Only adjust bounds if we have multiple profiles
    if (profiles.length > 1) {
      // Fix: Remove the padding property as it's not supported in the type definition
      mapRef.current.fitBounds(bounds);
    }
  }, [profiles, selectedProfile, mapLoaded]);

  // If we don't have an API key in localStorage and the default one is not valid
  if (!mapApiKey) {
    return (
      <div className="p-4 bg-card rounded-lg shadow-md h-full flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-2">
          Google Maps API Key Required
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please enter your Google Maps API key to display the map:
        </p>
        <input
          type="text"
          placeholder="Enter your Google Maps API key"
          className="w-full p-2 border rounded mb-2"
          onChange={handleApiKeyUpdate}
        />
        <p className="text-xs text-muted-foreground">
          Get a key at{" "}
          <a
            href="https://console.cloud.google.com/google/maps-apis/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Google Cloud Console
          </a>
        </p>
      </div>
    );
  }

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "var(--radius)",
  };

  const defaultCenter = {
    lat: 39.5,
    lng: -98.35,
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-muted">
      <LoadScript
        googleMapsApiKey={mapApiKey}
        onLoad={() => console.log("Google Maps script loaded")}
        onError={(error) => {
          console.error("Google Maps loading error:", error);
          toast({
            title: "Map Error",
            description:
              "Failed to load Google Maps. Please check your API key.",
            variant: "destructive",
          });
        }}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={3}
          onLoad={handleMapLoad}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {profiles.map((profile) => {
            const [lng, lat] = profile.address.coordinates;
            return (
              <Marker
                key={profile.id}
                position={{ lat, lng }}
                onClick={() => {
                  if (onSelectProfile) {
                    onSelectProfile(profile);
                  }
                  setActiveInfoWindow(profile.id);
                }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: "#3B82F6",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#FFFFFF",
                  scale: 8,
                }}
              >
                {activeInfoWindow === profile.id && (
                  <InfoWindow
                    position={{ lat, lng }}
                    onCloseClick={() => setActiveInfoWindow(null)}
                  >
                    <div className="p-1">
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={profile.photoUrl}
                          alt={profile.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <strong>{profile.name}</strong>
                      </div>
                      <p className="text-xs">
                        {profile.address.street}, {profile.address.city}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            );
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
