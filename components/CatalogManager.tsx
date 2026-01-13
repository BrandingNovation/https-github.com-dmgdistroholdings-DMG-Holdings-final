import React, { useState, useRef } from 'react';
import { SiteData, CatalogArtist, CatalogRelease, CatalogTrack } from '../types';

interface CatalogManagerProps {
  data: SiteData;
  onUpdate: (data: SiteData) => void;
}

const CatalogManager: React.FC<CatalogManagerProps> = ({ data, onUpdate }) => {
  type CatalogTabType = 'artists' | 'releases' | 'tracks';
  const [activeCatalogTab, setActiveCatalogTab] = useState<CatalogTabType>('artists');
  const [editingArtist, setEditingArtist] = useState<CatalogArtist | null>(null);
  const [editingRelease, setEditingRelease] = useState<CatalogRelease | null>(null);
  const [editingTrack, setEditingTrack] = useState<CatalogTrack | null>(null);
  
  const artistImageInputRef = useRef<HTMLInputElement>(null);
  const releaseCoverInputRef = useRef<HTMLInputElement>(null);
  const trackAudioInputRef = useRef<HTMLInputElement>(null);

  const artists = data.catalogArtists || [];
  const releases = data.catalogReleases || [];
  const tracks = data.catalogTracks || [];

  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Artist Management
  const addArtist = () => {
    const newArtist: CatalogArtist = {
      id: `artist_${Date.now()}`,
      name: '',
      bio: '',
      image: '',
      genre: [],
      contractType: 'distribution'
    };
    onUpdate({ ...data, catalogArtists: [...artists, newArtist] });
    setEditingArtist(newArtist);
  };

  const updateArtist = (updated: CatalogArtist) => {
    onUpdate({
      ...data,
      catalogArtists: artists.map(a => a.id === updated.id ? updated : a)
    });
    setEditingArtist(null);
  };

  const deleteArtist = (id: string) => {
    // Also delete associated releases and tracks
    const artistReleases = releases.filter(r => r.artistId === id);
    const releaseIds = artistReleases.map(r => r.id);
    const artistTracks = tracks.filter(t => t.artistId === id);
    
    onUpdate({
      ...data,
      catalogArtists: artists.filter(a => a.id !== id),
      catalogReleases: releases.filter(r => r.artistId !== id),
      catalogTracks: tracks.filter(t => t.artistId !== id && !releaseIds.includes(t.releaseId || ''))
    });
  };

  // Release Management
  const addRelease = () => {
    if (artists.length === 0) {
      alert('Please add an artist first');
      return;
    }
    const newRelease: CatalogRelease = {
      id: `release_${Date.now()}`,
      title: '',
      artistId: artists[0].id,
      releaseType: 'single',
      releaseDate: new Date().toISOString().split('T')[0],
      coverArt: '',
      trackIds: []
    };
    onUpdate({ ...data, catalogReleases: [...releases, newRelease] });
    setEditingRelease(newRelease);
  };

  const updateRelease = (updated: CatalogRelease) => {
    onUpdate({
      ...data,
      catalogReleases: releases.map(r => r.id === updated.id ? updated : r)
    });
    setEditingRelease(null);
  };

  const deleteRelease = (id: string) => {
    const release = releases.find(r => r.id === id);
    onUpdate({
      ...data,
      catalogReleases: releases.filter(r => r.id !== id),
      catalogTracks: tracks.filter(t => t.releaseId !== id)
    });
  };

  // Track Management
  const addTrack = () => {
    if (artists.length === 0) {
      alert('Please add an artist first');
      return;
    }
    const newTrack: CatalogTrack = {
      id: `track_${Date.now()}`,
      title: '',
      artistId: artists[0].id,
      audioUrl: ''
    };
    onUpdate({ ...data, catalogTracks: [...tracks, newTrack] });
    setEditingTrack(newTrack);
  };

  const updateTrack = (updated: CatalogTrack) => {
    onUpdate({
      ...data,
      catalogTracks: tracks.map(t => t.id === updated.id ? updated : t)
    });
    setEditingTrack(null);
  };

  const deleteTrack = (id: string) => {
    onUpdate({
      ...data,
      catalogTracks: tracks.filter(t => t.id !== id),
      catalogReleases: releases.map(r => ({
        ...r,
        trackIds: r.trackIds.filter(tId => tId !== id)
      }))
    });
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'artists' as CatalogTabType, label: 'Artists', count: artists.length },
          { id: 'releases' as CatalogTabType, label: 'Releases', count: releases.length },
          { id: 'tracks' as CatalogTabType, label: 'Tracks', count: tracks.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCatalogTab(tab.id)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCatalogTab === tab.id
                ? 'bg-red-600 text-white'
                : 'text-zinc-500 hover:text-zinc-300 bg-white/5'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Artists Tab */}
      {activeCatalogTab === 'artists' && (
        <div className="space-y-6">
          <button
            onClick={addArtist}
            className="w-full py-4 bg-red-600/10 text-red-600 border border-red-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all"
          >
            + Add Artist
          </button>

          {artists.map(artist => (
            <div key={artist.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-zinc-900 flex-shrink-0">
                  {artist.image ? (
                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-800 text-[8px] font-black uppercase">No Image</div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <input
                        value={artist.name}
                        onChange={e => updateArtist({ ...artist, name: e.target.value })}
                        className="w-full bg-transparent border-none text-lg font-black uppercase text-white mb-2"
                        placeholder="Artist Name"
                      />
                      <input
                        value={artist.location || ''}
                        onChange={e => updateArtist({ ...artist, location: e.target.value })}
                        className="w-full bg-transparent border-none text-[10px] text-zinc-500 uppercase"
                        placeholder="Location"
                      />
                    </div>
                    <button
                      onClick={() => deleteArtist(artist.id)}
                      className="text-red-600 text-xl hover:scale-110 transition-transform"
                    >
                      ×
                    </button>
                  </div>
                  <textarea
                    value={artist.bio}
                    onChange={e => updateArtist({ ...artist, bio: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 p-3 text-[10px] rounded-lg text-zinc-400 min-h-[60px]"
                    placeholder="Artist Biography"
                  />
                  <div className="flex gap-2">
                    <select
                      value={artist.contractType || 'distribution'}
                      onChange={e => updateArtist({ ...artist, contractType: e.target.value as any })}
                      className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-white"
                    >
                      <option value="exclusive">Exclusive</option>
                      <option value="distribution">Distribution</option>
                      <option value="management">Management</option>
                    </select>
                    <button
                      onClick={() => {
                        if (artistImageInputRef.current) {
                          artistImageInputRef.current.dataset.artistId = artist.id;
                          artistImageInputRef.current.click();
                        }
                      }}
                      className="px-4 py-2 bg-white/5 text-[9px] font-black uppercase text-zinc-400 hover:text-white transition-all border border-white/10 rounded-lg"
                    >
                      Upload Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <input
            ref={artistImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              const artistId = e.target.dataset.artistId;
              if (file && artistId) {
                handleImageUpload(file, url => {
                  const artist = artists.find(a => a.id === artistId);
                  if (artist) updateArtist({ ...artist, image: url });
                });
              }
            }}
          />
        </div>
      )}

      {/* Releases Tab */}
      {activeCatalogTab === 'releases' && (
        <div className="space-y-6">
          <button
            onClick={addRelease}
            className="w-full py-4 bg-red-600/10 text-red-600 border border-red-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all"
          >
            + Add Release
          </button>

          {releases.map(release => {
            const artist = artists.find(a => a.id === release.artistId);
            return (
              <div key={release.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border border-white/10 bg-zinc-900 flex-shrink-0">
                    {release.coverArt ? (
                      <img src={release.coverArt} alt={release.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-800 text-[8px] font-black uppercase">No Cover</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <input
                          value={release.title}
                          onChange={e => updateRelease({ ...release, title: e.target.value })}
                          className="w-full bg-transparent border-none text-lg font-black uppercase text-white"
                          placeholder="Release Title"
                        />
                        <select
                          value={release.artistId}
                          onChange={e => updateRelease({ ...release, artistId: e.target.value })}
                          className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-white"
                        >
                          {artists.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => deleteRelease(release.id)}
                        className="text-red-600 text-xl hover:scale-110 transition-transform"
                      >
                        ×
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={release.releaseType}
                        onChange={e => updateRelease({ ...release, releaseType: e.target.value as any })}
                        className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-white"
                      >
                        <option value="single">Single</option>
                        <option value="ep">EP</option>
                        <option value="album">Album</option>
                        <option value="mixtape">Mixtape</option>
                      </select>
                      <input
                        type="date"
                        value={release.releaseDate}
                        onChange={e => updateRelease({ ...release, releaseDate: e.target.value })}
                        className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={release.isrc || ''}
                        onChange={e => updateRelease({ ...release, isrc: e.target.value })}
                        className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-zinc-400"
                        placeholder="ISRC Code"
                      />
                      <input
                        value={release.upc || ''}
                        onChange={e => updateRelease({ ...release, upc: e.target.value })}
                        className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-zinc-400"
                        placeholder="UPC Code"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (releaseCoverInputRef.current) {
                          releaseCoverInputRef.current.dataset.releaseId = release.id;
                          releaseCoverInputRef.current.click();
                        }
                      }}
                      className="w-full px-4 py-2 bg-white/5 text-[9px] font-black uppercase text-zinc-400 hover:text-white transition-all border border-white/10 rounded-lg"
                    >
                      Upload Cover Art
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <input
            ref={releaseCoverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              const releaseId = e.target.dataset.releaseId;
              if (file && releaseId) {
                handleImageUpload(file, url => {
                  const release = releases.find(r => r.id === releaseId);
                  if (release) updateRelease({ ...release, coverArt: url });
                });
              }
            }}
          />
        </div>
      )}

      {/* Tracks Tab */}
      {activeCatalogTab === 'tracks' && (
        <div className="space-y-6">
          <button
            onClick={addTrack}
            className="w-full py-4 bg-red-600/10 text-red-600 border border-red-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all"
          >
            + Add Track
          </button>

          {tracks.map(track => {
            const artist = artists.find(a => a.id === track.artistId);
            const release = track.releaseId ? releases.find(r => r.id === track.releaseId) : null;
            return (
              <div key={track.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <input
                      value={track.title}
                      onChange={e => updateTrack({ ...track, title: e.target.value })}
                      className="w-full bg-transparent border-none text-lg font-black uppercase text-white"
                      placeholder="Track Title"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={track.artistId}
                        onChange={e => updateTrack({ ...track, artistId: e.target.value })}
                        className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-white"
                      >
                        {artists.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                      <select
                        value={track.releaseId || ''}
                        onChange={e => updateTrack({ ...track, releaseId: e.target.value || undefined })}
                        className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-white"
                      >
                        <option value="">No Release (Single)</option>
                        {releases.map(r => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        value={track.duration || ''}
                        onChange={e => updateTrack({ ...track, duration: parseInt(e.target.value) || undefined })}
                        className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-zinc-400"
                        placeholder="Duration (sec)"
                      />
                      <input
                        type="number"
                        value={track.bpm || ''}
                        onChange={e => updateTrack({ ...track, bpm: parseInt(e.target.value) || undefined })}
                        className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-zinc-400"
                        placeholder="BPM"
                      />
                      <input
                        value={track.key || ''}
                        onChange={e => updateTrack({ ...track, key: e.target.value })}
                        className="bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-zinc-400"
                        placeholder="Key"
                      />
                    </div>
                    <input
                      value={track.isrc || ''}
                      onChange={e => updateTrack({ ...track, isrc: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-2 text-[9px] rounded-lg text-zinc-400"
                      placeholder="ISRC Code"
                    />
                    {track.audioUrl ? (
                      <div className="p-3 bg-black/50 border border-white/10 rounded-lg">
                        <audio controls className="w-full" src={track.audioUrl} />
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (trackAudioInputRef.current) {
                            trackAudioInputRef.current.dataset.trackId = track.id;
                            trackAudioInputRef.current.click();
                          }
                        }}
                        className="w-full px-4 py-3 bg-white/5 text-[9px] font-black uppercase text-zinc-400 hover:text-white transition-all border border-white/10 rounded-lg"
                      >
                        Upload Audio File
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTrack(track.id)}
                    className="text-red-600 text-xl hover:scale-110 transition-transform ml-4"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}

          <input
            ref={trackAudioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              const trackId = e.target.dataset.trackId;
              if (file && trackId) {
                handleAudioUpload(file, url => {
                  const track = tracks.find(t => t.id === trackId);
                  if (track) updateTrack({ ...track, audioUrl: url });
                });
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CatalogManager;
