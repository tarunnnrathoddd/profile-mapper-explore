
import React, { useState } from 'react';
import { useProfiles } from '@/contexts/ProfileContext';
import ProfileCard from '@/components/ProfileCard';
import Map from '@/components/Map';
import Header from '@/components/Header';
import SearchAndFilter from '@/components/SearchAndFilter';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { profiles, selectedProfile, setSelectedProfile, isLoading } = useProfiles();
  const [mapVisible, setMapVisible] = useState(true);
  
  const handleShowSummary = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
      setMapVisible(true);
      // If on mobile, scroll to map
      if (window.innerWidth < 768) {
        setTimeout(() => {
          document.getElementById('map-container')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map section */}
          <div 
            id="map-container"
            className={`lg:sticky lg:top-24 h-[50vh] lg:h-[calc(100vh-7rem)] w-full lg:w-1/2 rounded-lg overflow-hidden bg-muted ${mapVisible ? 'block' : 'hidden md:block'}`}
          >
            <Map 
              profiles={profiles} 
              selectedProfile={selectedProfile}
              onSelectProfile={(profile) => setSelectedProfile(profile)} 
            />
          </div>
          
          {/* Profiles section */}
          <div className="w-full lg:w-1/2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Profiles</h1>
              <p className="text-muted-foreground mt-1">
                Browse through our collection of profiles
              </p>
            </div>
            
            <SearchAndFilter />
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center p-8 border rounded-lg">
                <h3 className="text-lg font-semibold">No profiles found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {profiles.map(profile => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onShowSummary={() => handleShowSummary(profile.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
