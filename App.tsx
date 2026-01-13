
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PortfolioSection from './components/PortfolioSection';
import VisionSection from './components/VisionSection';
import RosterSection from './components/RosterSection';
import CatalogDisplay from './components/CatalogDisplay';
import AiAssistant from './components/AiAssistant';
import Footer from './components/Footer';
import CMSPanel from './components/CMSPanel';
import Login from './components/Login';
import Newsletter from './components/Newsletter';
import CustomSections from './components/CustomSections';
import AudioPlayer from './components/AudioPlayer';
import InquiryModal from './components/InquiryModal';
import { SiteData } from './types';
import { loadSiteData, saveSiteData } from './services/dbService';

const INITIAL_DATA: SiteData = {
  theme: {
    background: "#050505",
    surface: "#0a0a0a",
    primary: "#ffffff",
    accent: "#a1a1aa"
  },
  adminPassword: "admin",
  spotifyPlaylistId: "37i9dQZF1DXcBWIGoYBM3M",
  activeAudioSource: 'archive',
  hero: {
    badge: "The Strategic Infrastructure for Independent Elite",
    title: "DMG DISTRIBUTION HOLDINGS",
    subtitle: "Architecting the future of independent music through strategic capital, global distribution, and world-class artist management.",
    image: "https://images.unsplash.com/photo-1514525253344-f814d0743b17?q=80&w=2000" 
  },
  vision: {
    title: "The Advantage",
    paragraphs: [
      "DMG Distribution Holdings was built on a simple, uncompromising truth: The artist is the ultimate asset.",
      "We bridge the gap between independent spirit and global industrial capacity. We are the guardians of creative legacy."
    ],
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000"
  },
  enterpriseSections: [
    {
      id: "es1",
      title: "Core Infrastructure",
      subtitle: "The essential foundations of the DMG ecosystem, providing global scale to independent talent.",
      items: [
        {
          id: "p1",
          name: "DMG Distributions",
          category: "Infrastructure",
          description: "Global delivery systems designed for the independent artist. We provide the pipes, you provide the art.",
          image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2000",
          features: ["Global DSP Delivery", "Direct-to-Fan Tech", "Master Preservation"]
        },
        {
          id: "p2",
          name: "DMG Management",
          category: "Strategy",
          description: "Elite talent architecture and brand development. We don't just manage careers; we engineer creative dynasties through precision positioning.",
          image: "https://images.unsplash.com/photo-1557426272-fc759fbb7a8d?q=80&w=2000",
          features: ["Brand Engineering", "Global Tour Strategy", "IP Portfolio Management"]
        }
      ]
    }
  ],
  roster: [
    {
      id: "r1",
      name: "DMG Nutso",
      role: "Flagship Artist",
      description: "Representing the core DNA of DMG. Nutso leverages our global distribution infrastructure to maintain 100% independence.",
      image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000"
    }
  ],
  newsletter: {
    title: "Strategic Intelligence",
    subtitle: "Subscribe to receive quarterly insights on independent distribution architecture and global talent management.",
    buttonText: "Join Intelligence",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000"
  },
  customSections: [],
  catalog: [
    {
      id: "t1",
      title: "Institutional Anthem",
      artist: "DMG Core",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    }
  ],
  // Enhanced Catalog System
  catalogArtists: [],
  catalogReleases: [],
  catalogTracks: [],
  visualDirectives: {
    "hero_image": "Urban street style, brutalist concrete, red neon light accent, high-end music executive vibe.",
    "vision_image": "Studio mixing board, selective red focus, dark industrial theme.",
    "enterpriseSections_0_items_0_image": "Music distribution cables, glowing red highlights, cinematic tech aesthetic.",
    "enterpriseSections_0_items_1_image": "Modern loft office, street-style corporate fashion, red accent lighting.",
    "roster_0_image": "High-contrast artist portrait, red rim light, urban backdrop."
  }
};

const App: React.FC = () => {
  const [data, setData] = useState<SiteData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Database Initialization with Global Fallback
  useEffect(() => {
    const init = async () => {
      const config = await loadSiteData(INITIAL_DATA);
      setData(config);
    };
    init();
  }, []);

  // Sync local changes (Admin only)
  useEffect(() => {
    if (data) {
      saveSiteData(data)
        .then(() => {
          // Silently save - no console spam
        })
        .catch(err => {
          console.error("Local sync error:", err);
          // Show error only if it's a critical failure
          if (err.name !== 'QuotaExceededError') {
            console.warn("Failed to save to IndexedDB:", err);
          }
        });
    }
  }, [data]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center gap-8">
        <div className="w-16 h-16 border-t-2 border-red-600 rounded-full animate-spin"></div>
        <div className="text-center">
           <h2 className="text-white text-xl font-black tracking-tighter uppercase italic">DMG <span className="text-red-600">COMMAND</span></h2>
           <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold mt-2">Loading Global Protocol</p>
        </div>
      </div>
    );
  }

  const handleLogin = (password: string) => {
    // Trim whitespace and check against stored password
    const trimmedPassword = password.trim();
    const storedPassword = data.adminPassword || 'admin';
    
    if (trimmedPassword === storedPassword) {
      setIsAdmin(true);
      setIsLoginOpen(false);
      return true;
    }
    return false;
  };

  const openInquiry = () => setIsInquiryOpen(true);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div 
      className="min-h-screen text-white selection:bg-red-600/30 transition-colors duration-700 overflow-x-hidden"
      style={{ backgroundColor: data.theme.background }}
    >
      <Navbar scrolled={scrolled} theme={data.theme} onOpenInquiry={openInquiry} onLogoClick={scrollToTop} />
      
      <main>
        <Hero data={data.hero} theme={data.theme} onOpenInquiry={openInquiry} />
        <VisionSection data={data.vision} theme={data.theme} />
        <PortfolioSection sections={data.enterpriseSections} theme={data.theme} onOpenInquiry={openInquiry} />
        <RosterSection data={data.roster} theme={data.theme} />
        <CatalogDisplay data={data} />
        <CustomSections sections={data.customSections} theme={data.theme} />
        <AiAssistant />
        <Newsletter data={data.newsletter} theme={data.theme} />
      </main>

      <Footer theme={data.theme} isAdmin={isAdmin} onOpenAdmin={() => setIsLoginOpen(true)} onExitAdmin={() => setIsAdmin(false)} onOpenInquiry={openInquiry} />
      
      <AudioPlayer catalog={data.catalog} spotifyPlaylistId={data.spotifyPlaylistId} activeAudioSource={data.activeAudioSource} theme={data.theme} />

      <button onClick={scrollToTop} className={`fixed bottom-24 right-6 md:right-12 z-[160] w-12 h-12 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center transition-all duration-500 hover:bg-red-600 hover:text-white shadow-2xl ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`} aria-label="Scroll to Top">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
      </button>

      {isLoginOpen && <Login onLogin={handleLogin} onClose={() => setIsLoginOpen(false)} />}
      {isAdmin && <CMSPanel data={data} onUpdate={setData} onExit={() => setIsAdmin(false)} />}
      <InquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} theme={data.theme} />
    </div>
  );
};

export default App;
