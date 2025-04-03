
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProfiles } from '@/contexts/ProfileContext';
import Map from '@/components/Map';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Globe, MapPin, Briefcase, Tag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

const ProfileDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, setSelectedProfile, isLoading } = useProfiles();
  
  const profile = profiles.find(p => p.id === id);
  
  useEffect(() => {
    if (profile) {
      setSelectedProfile(profile);
      document.title = `${profile.name} | Profile Mapper`;
    }
    
    return () => {
      setSelectedProfile(null);
      document.title = 'Profile Mapper';
    };
  }, [profile, setSelectedProfile]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container px-4 py-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container px-4 py-6">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
            <p className="text-muted-foreground mb-6">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/">Back to Profiles</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container px-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Information */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img 
                  src={profile.photoUrl} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                {profile.title && profile.company && (
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{profile.title} at {profile.company}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="prose max-w-none mb-6">
              <h3 className="text-xl font-semibold mb-2">About</h3>
              <p className="text-base">{profile.description}</p>
            </div>
            
            {profile.interests && profile.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <div key={index} className="bg-muted rounded-full px-3 py-1 text-sm flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {interest}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
              
              <div className="grid gap-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      {profile.address.street}<br />
                      {profile.address.city}, {profile.address.state} {profile.address.zipcode}<br />
                      {profile.address.country}
                    </p>
                  </div>
                </div>
                
                {profile.contactInfo?.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${profile.contactInfo.email}`} className="text-primary hover:underline">
                        {profile.contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {profile.contactInfo?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${profile.contactInfo.phone}`} className="text-primary hover:underline">
                        {profile.contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {profile.contactInfo?.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a 
                        href={profile.contactInfo.website.startsWith('http') ? profile.contactInfo.website : `https://${profile.contactInfo.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                      >
                        {profile.contactInfo.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
            <Map 
              profiles={[profile]} 
              selectedProfile={profile} 
              onSelectProfile={() => {}} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileDetails;
