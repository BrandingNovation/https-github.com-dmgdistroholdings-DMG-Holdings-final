import React, { useState } from 'react';
import { SiteData, CatalogArtist, CatalogRelease, CatalogTrack } from '../types';

interface CatalogDisplayProps {
  data: SiteData;
}

const CatalogDisplay: React.FC<CatalogDisplayProps> = ({ data }) => {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'artists' | 'releases' | 'tracks'>('artists');

  const artists = data.catalogArtists || [];
  const releases = data.catalogReleases || [];
  const tracks = data.catalogTracks || [];

  const filteredReleases = selectedArtist
    ? releases.filter(r => r.artistId === selectedArtist)
    : releases;

  const filteredTracks = selectedRelease
    ? tracks.filter(t => t.releaseId === selectedRelease)
    : selectedArtist
    ? tracks.filter(t => t.artistId === selectedArtist)
    : tracks;

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="catalog" className="min-h-screen bg-black py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-4">
            DMG <span className="text-red-600">CATALOG</span>
          </h2>
          <p className="text-zinc-400 text-sm uppercase tracking-widest font-bold">
            Institutional Asset Portfolio
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { id: 'artists' as const, label: 'Artists', count: artists.length },
            { id: 'releases' as const, label: 'Releases', count: releases.length },
            { id: 'tracks' as const, label: 'Tracks', count: tracks.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setViewMode(tab.id);
                setSelectedArtist(null);
                setSelectedRelease(null);
              }}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                viewMode === tab.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Artists View */}
        {viewMode === 'artists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map(artist => {
              const artistReleases = releases.filter(r => r.artistId === artist.id);
              const artistTracks = tracks.filter(t => t.artistId === artist.id);
              return (
                <div
                  key={artist.id}
                  onClick={() => {
                    setSelectedArtist(selectedArtist === artist.id ? null : artist.id);
                    setViewMode('releases');
                  }}
                  className="group cursor-pointer p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-red-600/50 transition-all space-y-4"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
                    {artist.image ? (
                      <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-800 text-2xl font-black uppercase">
                        {artist.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase italic text-white mb-2">{artist.name}</h3>
                    {artist.location && (
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">{artist.location}</p>
                    )}
                    {artist.bio && (
                      <p className="text-sm text-zinc-400 line-clamp-3 mb-4">{artist.bio}</p>
                    )}
                    <div className="flex gap-4 text-xs text-zinc-600 uppercase tracking-widest">
                      <span>{artistReleases.length} Releases</span>
                      <span>{artistTracks.length} Tracks</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Releases View */}
        {viewMode === 'releases' && (
          <div className="space-y-8">
            {selectedArtist && (
              <button
                onClick={() => {
                  setSelectedArtist(null);
                  setSelectedRelease(null);
                }}
                className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest font-bold mb-4"
              >
                ← Back to All Artists
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredReleases.map(release => {
                const artist = artists.find(a => a.id === release.artistId);
                const releaseTracks = tracks.filter(t => t.releaseId === release.id);
                return (
                  <div
                    key={release.id}
                    onClick={() => {
                      setSelectedRelease(selectedRelease === release.id ? null : release.id);
                      setViewMode('tracks');
                    }}
                    className="group cursor-pointer p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-red-600/50 transition-all"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-zinc-900 mb-4">
                      {release.coverArt ? (
                        <img src={release.coverArt} alt={release.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-800 text-lg font-black uppercase">
                          {release.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-black uppercase text-white mb-1 truncate">{release.title}</h4>
                    {artist && (
                      <p className="text-xs text-zinc-500 uppercase mb-2">{artist.name}</p>
                    )}
                    <div className="flex justify-between items-center text-[10px] text-zinc-600 uppercase tracking-widest">
                      <span>{release.releaseType}</span>
                      <span>{releaseTracks.length} Tracks</span>
                    </div>
                    {release.releaseDate && (
                      <p className="text-[10px] text-zinc-700 uppercase mt-2">
                        {new Date(release.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tracks View */}
        {viewMode === 'tracks' && (
          <div className="space-y-8">
            {(selectedArtist || selectedRelease) && (
              <button
                onClick={() => {
                  setSelectedRelease(null);
                  if (selectedRelease) {
                    setViewMode('releases');
                  } else {
                    setSelectedArtist(null);
                    setViewMode('artists');
                  }
                }}
                className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest font-bold mb-4"
              >
                ← Back
              </button>
            )}
            <div className="space-y-4">
              {filteredTracks.map(track => {
                const artist = artists.find(a => a.id === track.artistId);
                const release = track.releaseId ? releases.find(r => r.id === track.releaseId) : null;
                return (
                  <div
                    key={track.id}
                    className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-red-600/50 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="text-lg font-black uppercase text-white">{track.title}</h4>
                          {track.explicit && (
                            <span className="px-2 py-1 bg-red-600/20 text-red-500 text-[8px] font-black uppercase rounded">E</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-3">
                          {artist && <span>{artist.name}</span>}
                          {release && <span className="text-zinc-600">•</span>}
                          {release && <span>{release.title}</span>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-600 uppercase tracking-widest">
                          {track.duration && <span>{formatDuration(track.duration)}</span>}
                          {track.bpm && <span>{track.bpm} BPM</span>}
                          {track.key && <span>Key: {track.key}</span>}
                          {track.isrc && <span className="font-mono">{track.isrc}</span>}
                        </div>
                      </div>
                      {track.audioUrl && (
                        <div className="flex-shrink-0">
                          <audio controls className="h-10">
                            <source src={track.audioUrl} />
                          </audio>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {artists.length === 0 && releases.length === 0 && tracks.length === 0 && (
          <div className="text-center py-32">
            <p className="text-4xl font-black italic text-zinc-800 uppercase tracking-tighter mb-4">
              Catalog Empty
            </p>
            <p className="text-sm text-zinc-600 uppercase tracking-widest">
              Use the Admin Panel to add artists, releases, and tracks
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CatalogDisplay;
