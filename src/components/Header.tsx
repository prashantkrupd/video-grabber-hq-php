
import React from 'react';
import { Download } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-yt-blue text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Download className="h-8 w-8 text-yt-red mr-2" />
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-yt-red">YT</span>
            <span>Downloady</span>
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="hover:text-yt-accent transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/how-to-use" className="hover:text-yt-accent transition-colors">
                How to use
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-yt-accent transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
