import React, { useState, useMemo } from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { CreativeAsset, CreativeAssetType } from '../types';
import { CreativeThumbnail } from '../components/CreativeThumbnail';
import {
  Sparkles,
  Plus,
  Filter,
  Download,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  X,
  FileText,
  Building2,
  Tag
} from 'lucide-react';

export const CreativeAssetsView: React.FC = () => {
  const { assets, campaigns, addAsset, showToast } = useCampaigns();

  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [campaignFilter, setCampaignFilter] = useState<string>('ALL');
  const [selectedAsset, setSelectedAsset] = useState<CreativeAsset | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Asset Form State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<CreativeAssetType>('Photography');
  const [newCampaignId, setNewCampaignId] = useState(campaigns[0]?.id || '');
  const [newDimensions, setNewDimensions] = useState('1080 x 1080 px');
  const [newNotes, setNewNotes] = useState('');

  // Filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (typeFilter !== 'ALL' && asset.type !== typeFilter) return false;
      if (campaignFilter !== 'ALL' && asset.campaignId !== campaignFilter) return false;
      return true;
    });
  }, [assets, typeFilter, campaignFilter]);

  const handleDownload = (asset: CreativeAsset) => {
    showToast(`Downloading ${asset.name}...`, 'success');
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast('Asset name is required.', 'warning');
      return;
    }

    const linkedCamp = campaigns.find((c) => c.id === newCampaignId);

    addAsset({
      name: newName.trim(),
      type: newType,
      campaignId: newCampaignId,
      campaignTitle: linkedCamp ? linkedCamp.title : 'Autumn Trekking Nepal 2026',
      dimensions: newDimensions,
      fileSize: '3.2 MB',
      status: 'Approved',
      usageStatus: 'Ready',
      notes: newNotes || 'Added to creative library.',
      tags: ['Creative', newType],
    });

    setNewName('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const assetTypes: CreativeAssetType[] = [
    'Photography',
    'Infographic',
    'Graphic',
    'Template',
    'Video Still',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Creative Library
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Approved imagery, templates, and campaign creative directions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-stone-500 font-medium">
          <Filter size={13} />
          <span>Filter Assets:</span>
        </div>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
        >
          <option value="ALL">All Asset Types</option>
          {assetTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Campaign Filter */}
        <select
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
        >
          <option value="ALL">All Associated Campaigns</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        {(typeFilter !== 'ALL' || campaignFilter !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setTypeFilter('ALL');
              setCampaignFilter('ALL');
            }}
            className="text-xs text-[#7C3AED] hover:underline font-medium ml-auto"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <ImageIcon size={22} />
          </div>
          <p className="text-base font-semibold text-stone-800">No creative assets found</p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your filter selection or add a new creative visual asset.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="bg-white rounded-xl border border-stone-200 hover:border-stone-300 shadow-2xs hover:shadow-xs transition-all overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              {/* Asset Thumbnail */}
              <div className="h-44 w-full relative">
                <CreativeThumbnail
                  title={asset.name}
                  category={asset.type}
                  className="h-full rounded-none"
                />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-semibold border border-stone-200/80 shadow-2xs">
                  {asset.dimensions}
                </span>
              </div>

              {/* Asset Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {asset.type}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                      <CheckCircle2 size={10} /> {asset.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-sm leading-snug group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                    {asset.name}
                  </h3>

                  <div className="text-[11px] text-stone-500 truncate mt-1">
                    Campaign: <span className="text-stone-700 font-medium">{asset.campaignTitle}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span>{asset.fileSize}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(asset);
                    }}
                    className="p-1 text-stone-400 hover:text-stone-800 rounded hover:bg-stone-100 transition-colors"
                    title="Download asset"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ASSET DETAIL MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {selectedAsset.type}
                </span>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base truncate">
                  {selectedAsset.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="h-56 w-full relative rounded-xl overflow-hidden shadow-inner">
                <CreativeThumbnail
                  title={selectedAsset.name}
                  category={selectedAsset.type}
                  className="h-full rounded-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 uppercase font-semibold text-[10px] block">Dimensions</span>
                  <span className="font-bold text-stone-900">{selectedAsset.dimensions}</span>
                </div>
                <div>
                  <span className="text-stone-400 uppercase font-semibold text-[10px] block">File Size</span>
                  <span className="font-bold text-stone-900">{selectedAsset.fileSize}</span>
                </div>
                <div>
                  <span className="text-stone-400 uppercase font-semibold text-[10px] block">Format</span>
                  <span className="font-bold text-stone-900">PNG / WebP</span>
                </div>
                <div>
                  <span className="text-stone-400 uppercase font-semibold text-[10px] block">Approval</span>
                  <span className="font-bold text-emerald-700">{selectedAsset.status}</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                <span className="text-stone-400 uppercase font-semibold text-[10px] block">
                  Associated Campaign
                </span>
                <div className="font-bold text-stone-900">{selectedAsset.campaignTitle}</div>
              </div>

              {selectedAsset.notes && (
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
                  <span className="text-stone-400 uppercase font-semibold text-[10px] block">
                    Creative &amp; Art Notes
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {selectedAsset.notes}
                  </p>
                </div>
              )}

              {selectedAsset.tags && selectedAsset.tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Tag size={12} className="text-stone-400" />
                  <div className="flex flex-wrap gap-1">
                    {selectedAsset.tags.map((t, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDownload(selectedAsset)}
                className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> Download High-Res
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ASSET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <h3 className="font-bold text-stone-900 text-base">Add Creative Asset</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Asset Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Autumn Mountain Trail Hero"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Asset Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as CreativeAssetType)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  {assetTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Linked Campaign
                </label>
                <select
                  value={newCampaignId}
                  onChange={(e) => setNewCampaignId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={newDimensions}
                  onChange={(e) => setNewDimensions(e.target.value)}
                  placeholder="1080 x 1080 px"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Creative Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Guidelines for composition, photography, or copy overlay..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
