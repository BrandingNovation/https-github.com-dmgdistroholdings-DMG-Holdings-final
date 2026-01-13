
import React, { useState } from 'react';
import { SiteTheme } from '../types';

interface NavbarProps {
  scrolled: boolean;
  theme: SiteTheme;
  onOpenInquiry: () => void;
  onLogoClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, theme, onOpenInquiry, onLogoClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Vision', id: 'vision' },
    { label: 'Enterprises', id: 'portfolio' },
    { label: 'Roster', id: 'roster' },
    { label: 'Catalog', id: 'catalog' },
    { label: 'Intelligence', id: 'ai-assistant' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // Precise offset for the fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoInternalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLogoClick();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled ? 'py-4 border-b border-white/10 backdrop-blur-xl' : 'py-6 bg-transparent'
        }`} 
        style={{ 
          backgroundColor: scrolled ? `${theme.background}EE` : 'transparent',
          visibility: isMobileMenuOpen ? 'hidden' : 'visible'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={handleLogoInternalClick}
            className="flex items-center gap-2 group transition-transform hover:scale-105 relative z-[110]"
          >
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
              <span className="text-black font-black text-xs">DMG</span>
            </div>
            <span className="font-black tracking-tighter text-xl uppercase">
              DMG <span className="text-red-600 font-light">HOLDINGS</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all flex flex-col items-center group"
              >
                {item.label}
                <span className="w-0 h-[1px] bg-red-600 transition-all duration-300 group-hover:w-full mt-1"></span>
              </button>
            ))}
            <button
              onClick={onOpenInquiry}
              className="px-8 py-2.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-white hover:text-black transition-all active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            >
              Inquiry
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden relative z-[110] p-2 text-white focus:outline-none"
            aria-label="Open Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span className="h-[2px] bg-red-600 w-8"></span>
              <span className="h-[2px] bg-white w-5"></span>
              <span className="h-[2px] bg-white w-3"></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[200] transition-all duration-700 md:hidden flex flex-col ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        style={{ backgroundColor: theme.background }}
      >
        <div className="flex justify-between items-center px-6 py-6 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 flex items-center justify-center rounded-sm">
              <span className="text-white font-black text-[10px]">D</span>
            </div>
            <span className="font-black tracking-tighter text-sm uppercase">Navigation</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-white focus:outline-none group"
            aria-label="Close Menu"
          >
            <svg className="w-8 h-8 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-12 px-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.id)}
              className="text-4xl font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all transform active:scale-90 group relative"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
            </button>
          ))}
          
          <div className="w-20 h-[1px] bg-red-600/50 my-4"></div>
          
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenInquiry();
            }}
            className="px-14 py-6 bg-red-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-sm shadow-2xl active:scale-95"
          >
            Strategic Inquiry
          </button>
        </div>

        <div className="p-10 text-center border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 italic">
            DMG <span className="text-red-600">HOLDINGS</span> // GLOBAL ECOSYSTEM
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
