
export interface Profile {
  id: string;
  name: string;
  photoUrl: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  interests?: string[];
  company?: string;
  title?: string;
}

export interface MapMarker {
  id: string;
  longitude: number;
  latitude: number;
  profileId: string;
}
