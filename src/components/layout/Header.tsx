
import React from 'react';
import { Radar, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b border-mars-dark/30 py-4 px-6 glassmorphism sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="bg-mars relative w-10 h-10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="absolute inset-0 bg-mars-light/20 rounded-full animate-pulse"></div>
            <Radar className="text-white h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-mars">MARS</span>
            <span className="text-white">RESCUE</span>
          </h1>
        </div>
        
        <nav className="flex gap-6">
          <NavLink to="/" icon={<Radar size={20} />} label="Rover Detection" />
          <NavLink to="/pathfinder" icon={<MapPin size={20} />} label="Path Planning" />
          <NavLink to="/objects" icon={<Search size={20} />} label="Object Detection" />
        </nav>
      </div>
    </header>
  );
};

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const isActive = window.location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
        isActive 
          ? 'bg-mars text-white' 
          : 'text-gray-300 hover:bg-mars-dark/20 hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
};

export default Header;
