
export interface SiteTheme {
  background: string;
  surface: string;
  primary: string;
  accent: string;
}

export interface AssetVaultItem {
  id: string;
  url: string;
  timestamp: number;
  label: string;
}

export interface PortfolioItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
}

export interface EnterpriseSection {
  id: string;
  title: string;
  subtitle: string;
  items: PortfolioItem[];
}

export interface RosterItem {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

// Enhanced Catalog Types for Holdings Company
export interface CatalogArtist {
  id: string;
  name: string;
  bio: string;
  image: string;
  socialLinks?: {
    spotify?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  genre?: string[];
  location?: string;
  signedDate?: string;
  contractType?: 'exclusive' | 'distribution' | 'management';
}

export interface CatalogRelease {
  id: string;
  title: string;
  artistId: string; // Links to CatalogArtist
  releaseType: 'album' | 'ep' | 'single' | 'mixtape';
  releaseDate: string; // ISO date string
  coverArt: string;
  label?: string;
  catalogNumber?: string;
  upc?: string;
  isrc?: string;
  description?: string;
  genre?: string[];
  trackIds: string[]; // Links to CatalogTrack
  streamingLinks?: {
    spotify?: string;
    apple?: string;
    youtube?: string;
    soundcloud?: string;
  };
  revenue?: {
    total?: number;
    period?: string;
    currency?: string;
  };
}

export interface CatalogTrack {
  id: string;
  title: string;
  artistId: string; // Links to CatalogArtist
  releaseId?: string; // Links to CatalogRelease (optional for singles)
  audioUrl: string; // URL to audio file
  duration?: number; // in seconds
  bpm?: number;
  key?: string;
  genre?: string[];
  isrc?: string;
  writers?: string[];
  producers?: string[];
  releaseDate?: string;
  explicit?: boolean;
  featuredArtists?: string[];
  description?: string;
}

// Legacy AudioTrack for backward compatibility
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export interface SiteData {
  theme: SiteTheme;
  adminPassword?: string;
  spotifyPlaylistId?: string;
  activeAudioSource?: 'archive' | 'stream';
  visualDirectives?: Record<string, string>;
  assetLibrary?: AssetVaultItem[];
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    image: string;
  };
  vision: {
    title: string;
    paragraphs: string[];
    image: string;
  };
  enterpriseSections: EnterpriseSection[];
  roster: RosterItem[];
  newsletter: {
    title: string;
    subtitle: string;
    buttonText: string;
    image: string;
  };
  customSections: CustomSection[];
  catalog: AudioTrack[]; // Legacy - kept for backward compatibility
  // Enhanced Catalog System
  catalogArtists?: CatalogArtist[];
  catalogReleases?: CatalogRelease[];
  catalogTracks?: CatalogTrack[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
