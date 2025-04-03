
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Map, Settings, Search } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-secondary';
  };
  
  return (
    <header className="border-b sticky top-0 z-10 bg-background">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-bold text-xl flex items-center">
          <span className="text-primary mr-1">Profile</span>
          <span>Mapper</span>
        </Link>
        
        <nav className="hidden md:flex gap-1">
          <Button variant="ghost" asChild className={isActive('/')}>
            <Link to="/" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profiles</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className={isActive('/map')}>
            <Link to="/map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span>Map View</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className={isActive('/admin')}>
            <Link to="/admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </Button>
        </nav>
        
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
