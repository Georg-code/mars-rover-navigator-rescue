
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-mars-dark/30 mt-auto py-6 space-gradient">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Mars Rescue Portal | All data is simulated
            </p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-mars transition-colors text-sm">
              Mission Info
            </a>
            <a href="#" className="text-gray-400 hover:text-mars transition-colors text-sm">
              Contact Mission Control
            </a>
            <a href="#" className="text-gray-400 hover:text-mars transition-colors text-sm">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
