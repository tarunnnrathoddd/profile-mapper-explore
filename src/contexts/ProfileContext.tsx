
import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile } from "../types";
import { profileService } from "../data/profilesData";
import { toast } from "@/components/ui/use-toast";

interface ProfileContextType {
  profiles: Profile[];
  selectedProfile: Profile | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filterCriteria: { [key: string]: string };
  setSelectedProfile: (profile: Profile | null) => void;
  addProfile: (profile: Omit<Profile, "id">) => void;
  updateProfile: (id: string, profile: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  searchProfiles: (query: string) => void;
  filterProfiles: (criteria: { [key: string]: string }) => void;
  clearFilters: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Simulate API fetch
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        setTimeout(() => {
          const data = profileService.getAllProfiles();
          setProfiles(data);
          setIsLoading(false);
        }, 800); // Simulate network delay
      } catch (err) {
        setError("Failed to fetch profiles. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const addProfile = (profile: Omit<Profile, "id">) => {
    try {
      const newProfile = profileService.addProfile(profile);
      setProfiles([...profiles, newProfile]);
      toast({
        title: "Success",
        description: "Profile added successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add profile",
        variant: "destructive",
      });
    }
  };

  const updateProfile = (id: string, profile: Partial<Profile>) => {
    try {
      const updatedProfile = profileService.updateProfile(id, profile);
      if (updatedProfile) {
        setProfiles(profiles.map(p => p.id === id ? updatedProfile : p));
        if (selectedProfile?.id === id) {
          setSelectedProfile(updatedProfile);
        }
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const deleteProfile = (id: string) => {
    try {
      const success = profileService.deleteProfile(id);
      if (success) {
        setProfiles(profiles.filter(p => p.id !== id));
        if (selectedProfile?.id === id) {
          setSelectedProfile(null);
        }
        toast({
          title: "Success",
          description: "Profile deleted successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  const searchProfiles = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      // If search is cleared, apply only filters if they exist
      if (Object.keys(filterCriteria).length > 0) {
        const filteredProfiles = profileService.filterProfiles(filterCriteria);
        setProfiles(filteredProfiles);
      } else {
        // No search, no filters - show all
        setProfiles(profileService.getAllProfiles());
      }
    } else {
      // Search with query (and apply filters if they exist)
      let searchResults = profileService.searchProfiles(query);
      if (Object.keys(filterCriteria).length > 0) {
        searchResults = searchResults.filter(profile => {
          return Object.entries(filterCriteria).every(([key, value]) => {
            if (key.startsWith('address.')) {
              const addressKey = key.split('.')[1] as keyof typeof profile.address;
              return profile.address[addressKey]?.toString().toLowerCase().includes(value.toLowerCase());
            }
            if (key in profile) {
              const profileKey = key as keyof typeof profile;
              const profileValue = profile[profileKey];
              return typeof profileValue === 'string' && profileValue.toLowerCase().includes(value.toLowerCase());
            }
            return false;
          });
        });
      }
      setProfiles(searchResults);
    }
  };

  const filterProfiles = (criteria: { [key: string]: string }) => {
    setFilterCriteria({...filterCriteria, ...criteria});
    let filteredProfiles;
    
    // Apply both search and filters
    if (searchQuery.trim() !== "") {
      filteredProfiles = profileService.searchProfiles(searchQuery);
    } else {
      filteredProfiles = profileService.getAllProfiles();
    }
    
    // Apply new criteria
    const newCriteria = {...filterCriteria, ...criteria};
    if (Object.keys(newCriteria).length > 0) {
      filteredProfiles = filteredProfiles.filter(profile => {
        return Object.entries(newCriteria).every(([key, value]) => {
          if (value === "") return true; // Empty value means no filter for this field
          
          if (key.startsWith('address.')) {
            const addressKey = key.split('.')[1] as keyof typeof profile.address;
            return profile.address[addressKey]?.toString().toLowerCase().includes(value.toLowerCase());
          }
          if (key in profile) {
            const profileKey = key as keyof typeof profile;
            const profileValue = profile[profileKey];
            return typeof profileValue === 'string' && profileValue.toLowerCase().includes(value.toLowerCase());
          }
          return false;
        });
      });
    }
    
    setProfiles(filteredProfiles);
  };

  const clearFilters = () => {
    setFilterCriteria({});
    setSearchQuery("");
    setProfiles(profileService.getAllProfiles());
  };

  const value = {
    profiles,
    selectedProfile,
    isLoading,
    error,
    searchQuery,
    filterCriteria,
    setSelectedProfile,
    addProfile,
    updateProfile,
    deleteProfile,
    searchProfiles,
    filterProfiles,
    clearFilters
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfiles must be used within a ProfileProvider");
  }
  return context;
};
