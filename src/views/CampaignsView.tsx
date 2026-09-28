import React, { useState, useMemo } from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { CampaignStatus, Platform, ContentType } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PlatformBadge } from '../components/PlatformBadge';
import { CreativeThumbnail } from '../components/CreativeThumbnail';
import { CampaignDetailModal } from './CampaignDetailModal';
import {
  Search,
  Grid,
  List,
  Sparkles,
  Filter,
  Calendar,
  Eye,
  FileEdit,
  CheckCircle2,
  Send,
  Building2
} from 'lucide-react';

export const CampaignsView: React.FC = () => {
  const {
    campaigns,
    activeTab,
    setActiveTab,
    selectedCampaignId,
    setSelectedCampaignId,
    setEditingCampaignId,
    setReviewingCampaignId,
    setSchedulingCampaignId,
  } = useCampaigns();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((camp) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = camp.title.toLowerCase().includes(q);
        const matchesTopic = camp.topic.toLowerCase().includes(q);
        const matchesHeadline = camp.headline?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTopic && !matchesHeadline) {
          return false;
        }
      }
      // Status
      if (statusFilter !== 'ALL' && camp.status !== statusFilter) {
        return false;
      }
      // Platform
      if (platformFilter !== 'ALL' && camp.platform !== platformFilter) {
        return false;
      }
      // Content Type
      if (contentTypeFilter !== 'ALL' && camp.contentType !== contentTypeFilter) {
        return false;
      }
      return true;
    });
  }, [campaigns, searchQuery, statusFilter, platformFilter, contentTypeFilter]);

  const handleCreateClick = () => {
    setEditingCampaignId(null);
    setActiveTab('create');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Campaigns
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Manage content from idea to publication.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles size={16} />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Filter & Control Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search campaigns by name, topic, or headline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:bg-white transition-all"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="inline-flex rounded-lg bg-stone-100 p-1 border border-stone-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#7C3AED] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-[#7C3AED] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 font-medium">
            <Filter size={13} />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Idea">Idea</option>
            <option value="Development">Development</option>
            <option value="Review">Review</option>
            <option value="Approved">Approved</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Published">Published</option>
          </select>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          >
            <option value="ALL">All Platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>

          {/* Content Type Filter */}
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          >
            <option value="ALL">All Content Types</option>
            <option value="Social Media Post">Social Media Post</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Carousel">Carousel</option>
            <option value="Educational Post">Educational Post</option>
            <option value="Campaign Announcement">Campaign Announcement</option>
          </select>

          {(statusFilter !== 'ALL' || platformFilter !== 'ALL' || contentTypeFilter !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
                setPlatformFilter('ALL');
                setContentTypeFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-[#7C3AED] hover:underline font-medium ml-auto"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Content Rendering: Grid vs List */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-12 text-center">
          <p className="text-base font-semibold text-stone-800">No campaigns found</p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try changing your filters or create a new campaign brief to get started.
          </p>
          <button
            type="button"
            onClick={handleCreateClick}
            className="mt-4 px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <Sparkles size={14} /> Create Content Brief
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map((camp) => (
            <div
              key={camp.id}
              onClick={() => setSelectedCampaignId(camp.id)}
              className="bg-white rounded-xl border border-stone-200 hover:border-stone-300 shadow-2xs hover:shadow-xs transition-all overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              {/* Creative Thumbnail */}
              <div className="h-44 w-full relative">
                <CreativeThumbnail
                  title={camp.title}
                  category={camp.contentType}
                  platform={camp.platform}
                  className="h-full rounded-none"
                />
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <PlatformBadge platform={camp.platform} size="sm" />
                    <StatusBadge status={camp.status} size="sm" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                    {camp.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1">
                    <Building2 size={11} className="text-stone-400" />
                    <span className="truncate">{camp.organization}</span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                    {camp.headline || camp.topic}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center gap-1.5">
                    {camp.scheduledDate ? (
                      <span className="text-indigo-600 font-medium flex items-center gap-1">
                        <Calendar size={12} /> {camp.scheduledDate}
                      </span>
                    ) : (
                      <span>Updated {new Date(camp.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">{camp.contentType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Campaign</th>
                  <th className="py-3.5 px-4">Platform</th>
                  <th className="py-3.5 px-4">Content Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Scheduled / Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCampaigns.map((camp) => (
                  <tr
                    key={camp.id}
                    onClick={() => setSelectedCampaignId(camp.id)}
                    className="hover:bg-stone-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900 group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                        {camp.title}
                      </div>
                      <div className="text-[11px] text-stone-400 truncate mt-0.5">
                        {camp.topic}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PlatformBadge platform={camp.platform} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-600">
                      {camp.contentType}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={camp.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 text-xs">
                      {camp.scheduledDate ? (
                        <span className="font-medium text-indigo-700 flex items-center gap-1">
                          <Calendar size={12} /> {camp.scheduledDate}
                        </span>
                      ) : (
                        <span>{new Date(camp.createdAt).toLocaleDateString()}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCampaignId(camp.id);
                        }}
                        className="p-1.5 text-stone-400 hover:text-stone-800 rounded hover:bg-stone-100 transition-colors"
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {selectedCampaignId && (
        <CampaignDetailModal
          campaignId={selectedCampaignId}
          onClose={() => setSelectedCampaignId(null)}
        />
      )}
    </div>
  );
};
