
import React, { useState } from 'react';
import { useProfiles } from '@/contexts/ProfileContext';
import Header from '@/components/Header';
import ProfileForm from '@/components/ProfileForm';
import { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Search, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

const AdminPage = () => {
  const { profiles, isLoading, addProfile, updateProfile, deleteProfile } = useProfiles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleCreateProfile = () => {
    setCurrentProfile(null);
    setIsDialogOpen(true);
  };
  
  const handleEditProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    setIsDialogOpen(true);
  };
  
  const handleDeleteProfile = (id: string) => {
    setProfileToDelete(id);
    setIsAlertDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (profileToDelete) {
      deleteProfile(profileToDelete);
      setProfileToDelete(null);
      setIsAlertDialogOpen(false);
    }
  };
  
  const handleSubmit = (profile: Omit<Profile, 'id'>) => {
    if (currentProfile) {
      updateProfile(currentProfile.id, profile);
    } else {
      addProfile(profile);
    }
    setIsDialogOpen(false);
  };
  
  const filteredProfiles = searchQuery.trim() === ''
    ? profiles
    : profiles.filter(profile => 
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage profiles in the system
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Button onClick={handleCreateProfile} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add New Profile
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <h3 className="text-lg font-semibold">No profiles found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding a new profile'}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateProfile}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Profile
              </Button>
            )}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img 
                              src={profile.photoUrl} 
                              alt={profile.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{profile.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {profile.address.city}, {profile.address.state}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                        {profile.description}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {profile.contactInfo?.email || '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditProfile(profile)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteProfile(profile.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>
      
      {/* Profile Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProfile ? 'Edit Profile' : 'Create New Profile'}</DialogTitle>
            <DialogDescription>
              {currentProfile 
                ? 'Update the details for this profile.' 
                : 'Fill in the details to create a new profile.'}
            </DialogDescription>
          </DialogHeader>
          
          <ProfileForm 
            initialData={currentProfile || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              profile and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
