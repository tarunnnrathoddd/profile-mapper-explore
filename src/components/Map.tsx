import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Profile } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Replace this with your Mapbox token
// In production, you'd use environment variables
mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';

interface MapProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  onSelectProfile?: (profile: Profile) => void;
}

const Map: React.FC<MapProps> = ({ profiles, selectedProfile, onSelectProfile }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapToken, setMapToken] = useState<string | null>(localStorage.getItem('mapbox_token'));
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  // Handle map token update
  const handleTokenUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = e.target.value;
    setMapToken(token);
    localStorage.setItem('mapbox_token', token);
    window.location.reload(); // Reload to apply new token
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!mapToken) return;

    mapboxgl.accessToken = mapToken;
    
    try {
      // Initialize map
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: selectedProfile?.address.coordinates || [-98.35, 39.5], // Default to US center
        zoom: selectedProfile ? 10 : 3,
      });

      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      newMap.on('load', () => {
        setMapLoaded(true);
      });
      
      map.current = newMap;
      
      return () => {
        // Clean up map on unmount
        newMap.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map Error",
        description: "Failed to initialize the map. Please check your Mapbox token.",
        variant: "destructive"
      });
    }
  }, [mapToken]);

  // Update markers when profiles change or map loads
  useEffect(() => {
    if (!map.current || !mapLoaded || !profiles.length) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Create bounds to fit all markers
    const bounds = new mapboxgl.LngLatBounds();
    
    // Add markers for each profile
    profiles.forEach(profile => {
      const { coordinates } = profile.address;
      const [lng, lat] = coordinates;
      
      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'profile-marker';
      
      // Add marker to map
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="flex items-center gap-2 mb-1">
                <img src="${profile.photoUrl}" alt="${profile.name}" class="w-8 h-8 rounded-full" />
                <strong>${profile.name}</strong>
              </div>
              <p class="text-xs">${profile.address.street}, ${profile.address.city}</p>
            `)
        )
        .addTo(map.current);
      
      // Add click event to marker
      markerElement.addEventListener('click', () => {
        if (onSelectProfile) {
          onSelectProfile(profile);
        }
      });
      
      // Store reference to marker
      markersRef.current[profile.id] = marker;
      
      // Extend bounds to include this marker
      bounds.extend([lng, lat]);
    });

    // If there's only one profile, zoom to it
    if (profiles.length === 1) {
      map.current.flyTo({
        center: profiles[0].address.coordinates,
        zoom: 14,
        essential: true
      });
    } 
    // If there's a selected profile, focus on that
    else if (selectedProfile) {
      map.current.flyTo({
        center: selectedProfile.address.coordinates,
        zoom: 14,
        essential: true
      });
      
      // Open the popup for selected profile
      const marker = markersRef.current[selectedProfile.id];
      if (marker) {
        marker.togglePopup();
      }
    } 
    // Otherwise fit all markers in view
    else if (profiles.length > 1) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14
      });
    }
  }, [profiles, selectedProfile, onSelectProfile, mapLoaded]);

  // Update map when selected profile changes
  useEffect(() => {
    if (!map.current || !selectedProfile || !mapLoaded) return;
    
    map.current.flyTo({
      center: selectedProfile.address.coordinates,
      zoom: 14,
      essential: true
    });
    
    // Open the popup for selected profile
    const marker = markersRef.current[selectedProfile.id];
    if (marker) {
      marker.togglePopup();
    }
  }, [selectedProfile, mapLoaded]);

  if (!mapToken) {
    return (
      <div className="p-4 bg-card rounded-lg shadow-md h-full flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
        <p className="text-sm text-muted-foreground mb-4">Please enter your Mapbox token to display the map:</p>
        <input
          type="text"
          placeholder="Enter your Mapbox token"
          className="w-full p-2 border rounded mb-2"
          onChange={handleTokenUpdate}
        />
        <p className="text-xs text-muted-foreground">
          Get a token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
        </p>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden bg-muted">
      {!mapLoaded && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default Map;
