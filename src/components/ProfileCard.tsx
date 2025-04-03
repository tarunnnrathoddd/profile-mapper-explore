
import React from 'react';
import { Profile } from '@/types';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Phone, Globe, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileCardProps {
  profile: Profile;
  onShowSummary: () => void;
  compact?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onShowSummary, compact = false }) => {
  return (
    <Card className={`w-full overflow-hidden h-full transition-all hover:shadow-md`}>
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img 
              src={profile.photoUrl} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Link to={`/profile/${profile.id}`} className="text-lg font-semibold truncate hover:text-primary transition-colors">
              {profile.name}
            </Link>
            {profile.title && profile.company && (
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <Briefcase className="h-3 w-3" />
                <span className="truncate">{profile.title} at {profile.company}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-2">
        {!compact && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {profile.description}
          </p>
        )}
        
        <div className={`flex items-center text-sm text-muted-foreground gap-1 ${compact ? 'mb-0' : 'mb-2'}`}>
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">
            {profile.address.city}, {profile.address.state}, {profile.address.country}
          </span>
        </div>

        {!compact && profile.contactInfo && (
          <div className="grid grid-cols-1 gap-1 mt-3">
            {profile.contactInfo.email && (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{profile.contactInfo.email}</span>
              </div>
            )}
            
            {profile.contactInfo.phone && (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{profile.contactInfo.phone}</span>
              </div>
            )}
            
            {profile.contactInfo.website && (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Globe className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{profile.contactInfo.website}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 pt-0 pb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 mt-2"
          onClick={onShowSummary}
        >
          <MapPin className="h-4 w-4" />
          <span>Show on Map</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
