
import React, { useState, useRef, useEffect } from 'react';
import { SiteData, AudioTrack, PortfolioItem, AssetVaultItem } from '../types';
import { generateSiteImage, generateEnterpriseItem } from '../services/geminiService';
import { clearDatabase } from '../services/dbService';
import CatalogManager from './CatalogManager';

interface ImagePreviewProps {
  url: string;
  path: string[];
  label: string;
  directive: string;
  onDirectiveChange: (path: string[], val: string) => void;
  onGenerate: (path: string[], label: string) => void;
  onUpload: (path: string[]) => void;
  onOpenVault: (path: string[]) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  url, path, label, directive, onDirectiveChange, onGenerate, onUpload, onOpenVault 
}) => {
  return (
    <div className="space-y-4 p-5 bg-black/40 rounded-2xl border border-white/5 group">
      <div className="flex justify-between items-center">
        <label className="text-[9px] uppercase font-black text-zinc-600 tracking-widest block group-hover:text-zinc-400 transition-colors">
          {label}
        </label>
      </div>
      <div className="aspect-video rounded-xl overflow-hidden border border-white/5 relative bg-zinc-900 shadow-inner">
        {url ? (
          <img src={url} alt="Visual Outcome" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-zinc-800 uppercase font-black tracking-tighter">
            <span className="mb-2">No Visual Asset</span>
            <div className="w-8 h-[1px] bg-zinc-800"></div>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <input 
          value={directive}
          onChange={(e) => onDirectiveChange(path, e.target.value)}
          placeholder="Visual directive (e.g. 'Street style, red highlights')"
          className="w-full bg-black/50 border border-white/10 p-3 text-[10px] rounded-lg text-white font-mono placeholder:text-zinc-700 focus:border-white/30 transition-all"
        />
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => onGenerate(path, label)} className="bg-white text-black text-[9px] font-black uppercase py-3 rounded-lg hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1">
            AI
          </button>
          <button onClick={() => onOpenVault(path)} className="bg-white/5 text-zinc-400 text-[9px] font-black uppercase py-3 rounded-lg hover:bg-white/10 hover:text-white transition-all border border-white/10 flex items-center justify-center gap-1">
            Vault
          </button>
          <button onClick={() => onUpload(path)} className="bg-white/5 text-zinc-400 text-[9px] font-black uppercase py-3 rounded-lg hover:bg-white/10 hover:text-white transition-all border border-white/10">
            Up
          </button>
        </div>
      </div>
    </div>
  );
};

// Global helper for downloading assets
const downloadAsset = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'dmg_asset.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface VaultPickerProps {
  items: AssetVaultItem[];
  onSelect: (url: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const VaultPicker: React.FC<VaultPickerProps> = ({ items, onSelect, onDelete, onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] bg-black/98 backdrop-blur-3xl p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">Asset <span className="text-red-600">Vault</span></h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Strategic Deployment Module</p>
        </div>
        <button onClick={onClose} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">Exit Archive</button>
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-20 scrollbar-hide">
        {items.length === 0 ? (
          <div className="col-span-full py-32 text-center text-zinc-800 font-black uppercase tracking-tighter text-4xl italic opacity-20">Archive Offline</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-950 transition-all hover:border-red-600/50 shadow-2xl">
              <img src={item.url} alt={item.label} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                <p className="text-[8px] font-black text-white uppercase truncate mb-4 bg-black/60 px-2 py-1 rounded inline-block w-fit max-w-full">{item.label}</p>
                <div className="grid grid-cols-1 gap-2">
                  <button onClick={() => onSelect(item.url)} className="w-full bg-white text-black py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Select Asset</button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => downloadAsset(item.url, `DMG_${item.id}.png`)} className="bg-white/10 text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Export</button>
                    <button onClick={() => onDelete(item.id)} className="bg-red-600/20 text-red-500 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface CMSPanelProps {
  data: SiteData;
  onUpdate: (data: SiteData) => void;
  onExit: () => void;
}

const CMSPanel: React.FC<CMSPanelProps> = ({ data, onUpdate, onExit }) => {
  type TabType = 'branding' | 'vision' | 'enterprises' | 'talent' | 'newsletter' | 'media' | 'vault' | 'global';
  const [activeTab, setActiveTab] = useState<TabType>('branding');
  const [loading, setLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioAddInputRef = useRef<HTMLInputElement>(null);
  const audioReplaceInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  
  const [activeUploadPath, setActiveUploadPath] = useState<string[] | null>(null);
  const [activeVaultPath, setActiveVaultPath] = useState<string[] | null>(null);
  const [activeAudioReplaceId, setActiveAudioReplaceId] = useState<string | null>(null);

  const updateNestedValue = (path: string[], value: any, skipArchive = false) => {
    const newData = JSON.parse(JSON.stringify(data));
    let target: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
      if (!target[path[i]]) target[path[i]] = {};
      target = target[path[i]];
    }
    const label = path[path.length - 1];
    target[label] = value;
    
    // Auto-archive images to vault
    if (!skipArchive && typeof value === 'string' && (value.startsWith('data:image') || value.startsWith('http'))) {
      const currentLibrary = newData.assetLibrary || [];
      const newItem: AssetVaultItem = {
        id: Math.random().toString(36).substr(2, 9),
        url: value,
        label: `${path.join(' > ')}`,
        timestamp: Date.now()
      };
      newData.assetLibrary = [newItem, ...currentLibrary];
    }
    
    onUpdate(newData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadPath) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateNestedValue(activeUploadPath, reader.result as string);
        setActiveUploadPath(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(`Processing Institutional Audio...`);
      const reader = new FileReader();
      reader.onloadend = () => {
        const newTrack: AudioTrack = {
          id: Date.now().toString(),
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "DMG Artist",
          url: reader.result as string
        };
        onUpdate({ ...data, catalog: [...(data.catalog || []), newTrack] });
        if (audioAddInputRef.current) audioAddInputRef.current.value = "";
        setLoading(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageGen = async (path: string[], label: string) => {
    const pathKey = path.join('_');
    const customPrompt = (data.visualDirectives && data.visualDirectives[pathKey]) || "";
    setLoading(`Synthesizing Artistic Visual...`);
    const url = await generateSiteImage(label, customPrompt);
    if (url) updateNestedValue(path, url);
    setLoading(null);
  };

  const handleDirectiveChange = (path: string[], val: string) => {
    const pathKey = path.join('_');
    const newDirectives = { ...(data.visualDirectives || {}), [pathKey]: val };
    onUpdate({ ...data, visualDirectives: newDirectives });
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `site_data.json`;
    link.click();
  };

  return (
    <div className="fixed top-0 left-0 w-full md:w-[480px] h-screen bg-zinc-950 border-r border-white/10 z-[210] overflow-hidden shadow-2xl flex flex-col">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
      <input type="file" ref={audioAddInputRef} onChange={handleAudioAdd} className="hidden" accept="audio/*" />
      <input type="file" ref={audioReplaceInputRef} onChange={e => {
        const file = e.target.files?.[0];
        if (file && activeAudioReplaceId) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const newCatalog = data.catalog.map(t => t.id === activeAudioReplaceId ? { ...t, url: reader.result as string } : t);
            onUpdate({ ...data, catalog: newCatalog });
            setActiveAudioReplaceId(null);
          };
          reader.readAsDataURL(file);
        }
      }} className="hidden" accept="audio/*" />
      <input type="file" ref={importInputRef} onChange={e => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = ev => {
            try { onUpdate(JSON.parse(ev.target?.result as string)); alert("State Restored."); } catch (e) { alert("Invalid File."); }
          };
          reader.readAsText(file);
        }
      }} className="hidden" accept=".json" />

      {activeVaultPath && (
        <VaultPicker 
          items={data.assetLibrary || []} 
          onClose={() => setActiveVaultPath(null)}
          onSelect={(url) => {
            updateNestedValue(activeVaultPath, url, true);
            setActiveVaultPath(null);
          }}
          onDelete={(id) => {
            onUpdate({ ...data, assetLibrary: (data.assetLibrary || []).filter(i => i.id !== id) });
          }}
        />
      )}

      <div className="p-8 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl shrink-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter mb-1 text-white uppercase">DMG <span className="text-red-600">COMMAND</span></h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Ecosystem Manager</p>
          </div>
          <button onClick={onExit} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-white/10">Close</button>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar shadow-inner mb-6 gap-1">
          {[
            { id: 'branding', label: 'Hero' },
            { id: 'vision', label: 'Vision' },
            { id: 'enterprises', label: 'Groups' },
            { id: 'talent', label: 'Roster' },
            { id: 'newsletter', label: 'Mail' },
            { id: 'media', label: 'Audio' },
            { id: 'vault', label: 'Vault' },
            { id: 'global', label: 'Security' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex-1 py-2 px-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32 scrollbar-hide">
        {loading && (
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl animate-pulse flex items-center gap-4">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white">{loading}</p>
          </div>
        )}

        {activeTab === 'branding' && (
          <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-2">Hero Infrastructure</h3>
              <ImagePreview url={data.hero.image} path={['hero', 'image']} label="Hero Cinematic Asset" directive={(data.visualDirectives?.hero_image) || ""} onDirectiveChange={handleDirectiveChange} onGenerate={handleImageGen} onUpload={path => { setActiveUploadPath(path); fileInputRef.current?.click(); }} onOpenVault={path => setActiveVaultPath(path)} />
              <div className="space-y-4">
                <input value={data.hero.title} onChange={e => updateNestedValue(['hero', 'title'], e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 text-xs rounded-2xl text-white font-bold" placeholder="Hero Title" />
                <textarea value={data.hero.subtitle} onChange={e => updateNestedValue(['hero', 'subtitle'], e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 text-xs rounded-2xl min-h-[100px] text-zinc-400" placeholder="Hero Subtitle" />
              </div>
            </div>
          </section>
        )}

        {activeTab === 'vision' && (
          <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-2">Vision & Strategy</h3>
              <ImagePreview url={data.vision.image} path={['vision', 'image']} label="Vision Asset" directive={(data.visualDirectives?.vision_image) || ""} onDirectiveChange={handleDirectiveChange} onGenerate={handleImageGen} onUpload={path => { setActiveUploadPath(path); fileInputRef.current?.click(); }} onOpenVault={path => setActiveVaultPath(path)} />
              <div className="space-y-4">
                <input value={data.vision.title} onChange={e => updateNestedValue(['vision', 'title'], e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 text-xs rounded-2xl text-white font-bold" placeholder="Vision Title" />
                {data.vision.paragraphs.map((p, pIdx) => (
                  <textarea key={pIdx} value={p} onChange={e => { const newP = [...data.vision.paragraphs]; newP[pIdx] = e.target.value; updateNestedValue(['vision', 'paragraphs'], newP); }} className="w-full bg-black/40 border border-white/10 p-4 text-xs rounded-2xl min-h-[80px] text-zinc-400" />
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'enterprises' && (
          <section className="space-y-12">
            <button onClick={() => updateNestedValue(['enterpriseSections'], [...data.enterpriseSections, { id: Date.now().toString(), title: "New Group", subtitle: "Strategic subtitle.", items: [] }])} className="w-full py-5 bg-red-600/5 text-[10px] uppercase font-black text-red-600 border border-dashed border-red-600/20 rounded-2xl hover:bg-red-600/10 transition-all">+ Add Enterprise Group</button>
            {data.enterpriseSections.map((section, sIdx) => (
              <div key={section.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                <div className="flex justify-between items-center">
                  <input value={section.title} onChange={e => { const newS = [...data.enterpriseSections]; newS[sIdx].title = e.target.value; onUpdate({ ...data, enterpriseSections: newS }); }} className="bg-transparent border-none text-xl font-black italic uppercase text-white" />
                  <button onClick={() => onUpdate({ ...data, enterpriseSections: data.enterpriseSections.filter(s => s.id !== section.id) })} className="text-red-600 text-[10px] font-black uppercase">Delete</button>
                </div>
                {section.items.map((item, iIdx) => (
                  <div key={item.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                    <ImagePreview url={item.image} path={['enterpriseSections', sIdx.toString(), 'items', iIdx.toString(), 'image']} label={item.name} directive={(data.visualDirectives?.[`enterpriseSections_${sIdx}_items_${iIdx}_image`]) || ""} onDirectiveChange={handleDirectiveChange} onGenerate={handleImageGen} onUpload={path => { setActiveUploadPath(path); fileInputRef.current?.click(); }} onOpenVault={path => setActiveVaultPath(path)} />
                    <input value={item.name} onChange={e => { const newS = JSON.parse(JSON.stringify(data.enterpriseSections)); newS[sIdx].items[iIdx].name = e.target.value; onUpdate({ ...data, enterpriseSections: newS }); }} className="w-full bg-transparent border-none p-0 text-lg font-black uppercase italic text-white" />
                  </div>
                ))}
                <button onClick={() => { const newS = JSON.parse(JSON.stringify(data.enterpriseSections)); newS[sIdx].items.push({ id: Date.now().toString(), name: "New Enterprise", category: "Core", description: "", image: "", features: [] }); onUpdate({ ...data, enterpriseSections: newS }); }} className="w-full py-4 bg-white/5 text-[10px] uppercase font-black text-zinc-500 border border-white/5 rounded-xl transition-all hover:bg-white/10">+ Add Item</button>
              </div>
            ))}
          </section>
        )}

        {activeTab === 'talent' && (
          <section className="space-y-12">
            {data.roster.map((artist, idx) => (
              <div key={artist.id} className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                <ImagePreview 
                  url={artist.image} 
                  path={['roster', idx.toString(), 'image']} 
                  label={artist.name} 
                  directive={data.visualDirectives?.[`roster_${idx}_image`] || ""} 
                  onDirectiveChange={handleDirectiveChange} 
                  onGenerate={handleImageGen} 
                  onUpload={path => { setActiveUploadPath(path); fileInputRef.current?.click(); }} 
                  onOpenVault={path => setActiveVaultPath(path)} 
                />
                <div className="flex justify-between items-center">
                  <input value={artist.name} onChange={e => { const newR = [...data.roster]; newR[idx].name = e.target.value; onUpdate({ ...data, roster: newR }); }} className="bg-transparent border-none text-2xl font-black uppercase italic text-white" />
                  <button onClick={() => updateNestedValue(['roster'], data.roster.filter(r => r.id !== artist.id))} className="text-red-600 font-black">×</button>
                </div>
                <input value={artist.role} onChange={e => { const newR = [...data.roster]; newR[idx].role = e.target.value; onUpdate({ ...data, roster: newR }); }} className="w-full bg-black/20 border border-white/10 p-3 text-[10px] rounded-xl text-zinc-500 uppercase font-black tracking-widest" placeholder="Artist Role" />
              </div>
            ))}
            <button onClick={() => updateNestedValue(['roster'], [...data.roster, { id: Date.now().toString(), name: "New Talent", role: "Artist", description: "", image: "" }])} className="w-full py-5 bg-white/5 text-[10px] uppercase font-black text-zinc-500 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">+ Add New Artist</button>
          </section>
        )}

        {activeTab === 'newsletter' && (
          <section className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-2">Intelligence Subscription</h3>
              <ImagePreview url={data.newsletter.image} path={['newsletter', 'image']} label="Newsletter Background" directive={(data.visualDirectives?.newsletter_image) || ""} onDirectiveChange={handleDirectiveChange} onGenerate={handleImageGen} onUpload={path => { setActiveUploadPath(path); fileInputRef.current?.click(); }} onOpenVault={path => setActiveVaultPath(path)} />
              <input value={data.newsletter.title} onChange={e => updateNestedValue(['newsletter', 'title'], e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 text-xs rounded-2xl text-white font-bold" placeholder="Newsletter Title" />
              <textarea value={data.newsletter.subtitle} onChange={e => updateNestedValue(['newsletter', 'subtitle'], e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 text-xs rounded-2xl min-h-[80px] text-zinc-400" placeholder="Newsletter Subtitle" />
            </div>
          </section>
        )}

        {activeTab === 'media' && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">Holdings Catalog Management</h3>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Manage Artists, Releases, and Tracks for Investor Review</p>
            </div>
            <CatalogManager data={data} onUpdate={onUpdate} />
          </section>
        )}

        {activeTab === 'vault' && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600">Institutional Repository</h3>
              <span className="text-[9px] font-mono text-zinc-500">{data.assetLibrary?.length || 0} ASSETS ARCHIVED</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data.assetLibrary && data.assetLibrary.length > 0 ? (
                data.assetLibrary.map((item) => (
                  <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 shadow-xl">
                    <img src={item.url} alt={item.label} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* Hover Controls Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-2">
                       <p className="text-[8px] font-black uppercase text-white truncate w-full text-center mb-2">{item.label}</p>
                       <div className="grid grid-cols-2 gap-2 w-full">
                         <button 
                            onClick={() => downloadAsset(item.url, `DMG_${item.id}.png`)}
                            className="bg-white text-black text-[9px] font-black uppercase py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                         >
                           DL
                         </button>
                         <button 
                            onClick={() => onUpdate({ ...data, assetLibrary: data.assetLibrary?.filter(i => i.id !== item.id) })}
                            className="bg-red-600/20 text-red-500 text-[9px] font-black uppercase py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                         >
                           Del
                         </button>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-zinc-800 font-black uppercase tracking-widest italic opacity-20">Vault Empty</div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'global' && (
          <section className="space-y-12">
            {/* Security & Access */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-2">Security & Access</h3>
              <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase font-black text-zinc-500 tracking-widest block">Admin Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={data.adminPassword || 'admin'}
                      onChange={e => updateNestedValue(['adminPassword'], e.target.value)}
                      className="w-full bg-black/50 border border-white/10 p-3 pr-20 text-[11px] rounded-lg text-white font-mono placeholder:text-zinc-700 focus:border-white/30 transition-all"
                      placeholder="Set admin password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/5 text-zinc-400 hover:text-white text-[8px] font-black uppercase tracking-widest rounded border border-white/10 transition-all"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] text-zinc-600 uppercase tracking-widest">
                      {data.adminPassword ? `Current: ${data.adminPassword.length} characters` : 'Default: admin'}
                    </p>
                    <button
                      onClick={() => {
                        const newPass = prompt('Enter new admin password (min 4 characters):');
                        if (newPass && newPass.length >= 4) {
                          updateNestedValue(['adminPassword'], newPass);
                          alert('✓ Password updated successfully. You will need to log in again after saving.');
                        } else if (newPass) {
                          alert('✗ Password must be at least 4 characters.');
                        }
                      }}
                      className="px-4 py-2 bg-red-600/10 text-red-600 border border-red-600/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                      Set New
                    </button>
                  </div>
                  <p className="text-[8px] text-zinc-500 italic">
                    Change this password to secure your admin panel. Minimum 4 characters recommended.
                  </p>
                </div>
              </div>
            </div>

            {/* Theme Colors */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-2">Institutional Palette</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(data.theme).map(key => (
                  <div key={key} className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-zinc-500">{key}</label>
                    <input type="color" value={(data.theme as any)[key]} onChange={e => updateNestedValue(['theme', key], e.target.value)} className="w-full h-10 rounded-xl border-none bg-transparent cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-8 border-t border-white/5">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-2 mb-4">Danger Zone</h3>
              <button onClick={async () => { if (confirm("DANGER: Wipes browser cache. Continue?")) { await clearDatabase(); window.location.reload(); } }} className="w-full py-4 bg-red-600/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-600/20 hover:bg-red-600 hover:text-white transition-all">Emergency Local Reset</button>
            </div>
          </section>
        )}
      </div>

      <div className="mt-auto p-8 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-3">
           <button onClick={downloadJson} className="py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all">Download Publish File</button>
           <button onClick={() => importInputRef.current?.click()} className="py-3 bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 rounded-xl border border-white/5">Import State</button>
        </div>
      </div>
    </div>
  );
};

export default CMSPanel;
