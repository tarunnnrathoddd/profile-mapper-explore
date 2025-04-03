
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useProfiles } from '@/contexts/ProfileContext';

const SearchAndFilter: React.FC = () => {
  const { searchQuery, searchProfiles, filterCriteria, filterProfiles, clearFilters } = useProfiles();
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [filters, setFilters] = useState({
    city: filterCriteria['address.city'] || '',
    state: filterCriteria['address.state'] || '',
    country: filterCriteria['address.country'] || '',
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchProfiles(value);
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const applyFilters = () => {
    const formattedFilters = {
      'address.city': filters.city,
      'address.state': filters.state,
      'address.country': filters.country,
    };
    
    filterProfiles(formattedFilters);
  };
  
  const resetFilters = () => {
    setFilters({
      city: '',
      state: '',
      country: '',
    });
    setSearchTerm('');
    clearFilters();
  };
  
  const hasActiveFilters = Object.values(filters).some(val => val !== '') || searchTerm !== '';
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search profiles..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-8"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={() => {
              setSearchTerm('');
              searchProfiles('');
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter Profiles</h4>
              <p className="text-sm text-muted-foreground">
                Narrow down profiles by location.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <Input
                  id="city"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">
                  State
                </Label>
                <Input
                  id="state"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  Country
                </Label>
                <Input
                  id="country"
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchAndFilter;
