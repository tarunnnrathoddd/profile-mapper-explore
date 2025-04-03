
import { Profile } from "../types";

// Mock profiles data
export const profiles: Profile[] = [
  {
    id: "1",
    name: "Alex Johnson",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    description: "Software Engineer passionate about creating intuitive user experiences and solving complex problems.",
    address: {
      street: "123 Tech Avenue",
      city: "San Francisco",
      state: "CA",
      zipcode: "94105",
      country: "USA",
      coordinates: [-122.4194, 37.7749], // San Francisco coordinates
    },
    contactInfo: {
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      website: "alexjohnson.dev",
    },
    interests: ["Programming", "Hiking", "Photography"],
    company: "TechCorp",
    title: "Senior Developer",
  },
  {
    id: "2",
    name: "Samantha Williams",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    description: "Marketing specialist with 5 years of experience in digital marketing and brand strategy.",
    address: {
      street: "456 Madison Avenue",
      city: "New York",
      state: "NY",
      zipcode: "10022",
      country: "USA",
      coordinates: [-73.9654, 40.7128], // New York coordinates
    },
    contactInfo: {
      email: "samantha.w@example.com",
      phone: "+1 (555) 234-5678",
      website: "samanthaw.co",
    },
    interests: ["Marketing", "Travel", "Cooking"],
    company: "Global Marketing Inc.",
    title: "Brand Strategist",
  },
  {
    id: "3",
    name: "David Chen",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    description: "Data scientist specializing in machine learning algorithms and predictive analytics.",
    address: {
      street: "789 Analytics Drive",
      city: "Seattle",
      state: "WA",
      zipcode: "98101",
      country: "USA",
      coordinates: [-122.3321, 47.6062], // Seattle coordinates
    },
    contactInfo: {
      email: "david.chen@example.com",
      phone: "+1 (555) 345-6789",
    },
    interests: ["AI", "Statistics", "Chess"],
    company: "Data Insights Co.",
    title: "Lead Data Scientist",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    description: "UX/UI Designer focused on creating accessible and beautiful digital experiences.",
    address: {
      street: "101 Design Boulevard",
      city: "Austin",
      state: "TX",
      zipcode: "78701",
      country: "USA",
      coordinates: [-97.7431, 30.2672], // Austin coordinates
    },
    contactInfo: {
      email: "emily.rodriguez@example.com",
      phone: "+1 (555) 456-7890",
      website: "emilydesigns.io",
    },
    interests: ["Design", "Art", "Technology"],
    company: "Creative Solutions",
    title: "Senior UX Designer",
  },
  {
    id: "5",
    name: "Marcus Green",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    description: "Environmental consultant specializing in sustainable business practices and green technology.",
    address: {
      street: "555 Eco Street",
      city: "Portland",
      state: "OR",
      zipcode: "97201",
      country: "USA",
      coordinates: [-122.6784, 45.5152], // Portland coordinates
    },
    contactInfo: {
      email: "marcus.green@example.com",
      phone: "+1 (555) 567-8901",
    },
    interests: ["Sustainability", "Cycling", "Gardening"],
    company: "EcoSolutions",
    title: "Sustainability Consultant",
  },
];

// Profile service class
class ProfileService {
  private profiles: Profile[] = [...profiles];

  getAllProfiles(): Profile[] {
    return [...this.profiles];
  }

  getProfileById(id: string): Profile | undefined {
    return this.profiles.find(profile => profile.id === id);
  }

  addProfile(profile: Omit<Profile, "id">): Profile {
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  updateProfile(id: string, profile: Partial<Profile>): Profile | undefined {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index !== -1) {
      this.profiles[index] = { ...this.profiles[index], ...profile };
      return this.profiles[index];
    }
    return undefined;
  }

  deleteProfile(id: string): boolean {
    const initialLength = this.profiles.length;
    this.profiles = this.profiles.filter(profile => profile.id !== id);
    return this.profiles.length < initialLength;
  }

  searchProfiles(query: string): Profile[] {
    const lowercaseQuery = query.toLowerCase();
    return this.profiles.filter(profile => {
      return (
        profile.name.toLowerCase().includes(lowercaseQuery) ||
        profile.description.toLowerCase().includes(lowercaseQuery) ||
        profile.address.city.toLowerCase().includes(lowercaseQuery) ||
        profile.address.state.toLowerCase().includes(lowercaseQuery) ||
        profile.address.country.toLowerCase().includes(lowercaseQuery)
      );
    });
  }

  filterProfiles(criteria: { [key: string]: string }): Profile[] {
    return this.profiles.filter(profile => {
      return Object.entries(criteria).every(([key, value]) => {
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
}

export const profileService = new ProfileService();
