
import React from 'react';
import { useProfiles } from '@/contexts/ProfileContext';
import Map from '@/components/Map';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import SearchAndFilter from '@/components/SearchAndFilter';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const MapView = () => {
  const { profiles, selectedProfile, setSelectedProfile, isLoading } = useProfiles();
  const [showProfiles, setShowProfiles] = React.useState(true);
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 relative">
          {/* Full-screen map */}
          <div className="absolute inset-0">
            <Map 
              profiles={profiles} 
              selectedProfile={selectedProfile} 
              onSelectProfile={(profile) => setSelectedProfile(profile)}
            />
          </div>
          
          {/* Overlay for profiles */}
          <div className={`absolute bottom-0 left-0 right-0 bg-background rounded-t-lg shadow-lg transition-all duration-300 ease-in-out transform ${showProfiles ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'} z-10 max-h-[70vh]`}>
            <div 
              className="p-3 border-b flex justify-between items-center cursor-pointer"
              onClick={() => setShowProfiles(!showProfiles)}
            >
              <h2 className="font-semibold">
                {selectedProfile ? selectedProfile.name : 'All Profiles'} 
                {profiles.length > 0 && !selectedProfile && ` (${profiles.length})`}
              </h2>
              <Button variant="ghost" size="icon">
                {showProfiles ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="p-4">
              <SearchAndFilter />
              
              <ScrollArea className="h-[calc(70vh-9rem)] pr-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : selectedProfile ? (
                  <div className="pb-4">
                    <ProfileCard
                      profile={selectedProfile}
                      onShowSummary={() => {}}
                    />
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedProfile(null)}
                      >
                        Show All Profiles
                      </Button>
                    </div>
                  </div>
                ) : profiles.length === 0 ? (
                  <div className="text-center p-8">
                    <h3 className="text-lg font-semibold">No profiles found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {profiles.map(profile => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        compact
                        onShowSummary={() => setSelectedProfile(profile)}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapView;
