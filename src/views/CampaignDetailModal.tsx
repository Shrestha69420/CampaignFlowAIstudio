import React, { useState } from 'react';
import { Campaign, Platform } from '../types';
import { useCampaigns } from '../context/CampaignContext';
import { StatusBadge } from '../components/StatusBadge';
import { PlatformBadge } from '../components/PlatformBadge';
import { SocialPreview } from '../components/SocialPreview';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Send,
  FileEdit,
  Tag,
  Share2,
  ExternalLink,
  Layers,
  Camera,
  Compass,
  Building2
} from 'lucide-react';

interface CampaignDetailModalProps {
  campaignId: string;
  onClose: () => void;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaignId, onClose }) => {
  const {
    campaigns,
    assets,
    setActiveTab,
    setEditingCampaignId,
    setSchedulingCampaignId,
    setReviewingCampaignId,
    publishCampaign,
  } = useCampaigns();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'content' | 'creative' | 'approval' | 'schedule'>('overview');

  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return null;
  }

  const associatedAssets = assets.filter((a) => a.campaignId === campaign.id || a.campaignTitle === campaign.title);

  const handleEdit = () => {
    setEditingCampaignId(campaign.id);
    setActiveTab('create');
    onClose();
  };

  const handleOpenReview = () => {
    setReviewingCampaignId(campaign.id);
    setActiveTab('approvals');
    onClose();
  };

  const handleOpenSchedule = () => {
    setSchedulingCampaignId(campaign.id);
    setActiveTab('calendar');
    onClose();
  };

  const handlePublish = () => {
    publishCampaign(campaign.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-start justify-between bg-stone-50/50">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <StatusBadge status={campaign.status} size="md" />
              <PlatformBadge platform={campaign.platform} size="md" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                {campaign.contentType}
              </span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Building2 size={12} /> {campaign.organization}
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              {campaign.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-stone-200 bg-white flex items-center gap-6 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'content', label: 'Content' },
            { id: 'creative', label: 'Creative' },
            { id: 'approval', label: 'Approval' },
            { id: 'schedule', label: 'Schedule' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-3 border-b-2 transition-all ${
                activeSubTab === tab.id
                  ? 'border-[#7C3AED] text-[#7C3AED]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-stone-50/40 text-sm">
          {/* Tab 1: Overview */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Campaign Goal
                  </div>
                  <p className="text-stone-800 leading-relaxed font-medium">
                    {campaign.goal || 'No explicit goal defined.'}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Target Audience
                  </div>
                  <p className="text-stone-800 leading-relaxed font-medium">
                    {campaign.targetAudience || 'General audience'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Topic
                    </div>
                    <div className="text-stone-900 font-semibold">{campaign.topic}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Tone of Voice
                    </div>
                    <div className="text-stone-900 font-semibold">{campaign.tone}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Platform & Type
                    </div>
                    <div className="text-stone-900 font-semibold">
                      {campaign.platform} • {campaign.contentType}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Key Message
                  </div>
                  <p className="text-stone-700 leading-relaxed">
                    {campaign.keyMessage}
                  </p>
                </div>

                {campaign.additionalInstructions && (
                  <div className="pt-3 border-t border-stone-100">
                    <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Additional Brief Instructions
                    </div>
                    <p className="text-stone-600 text-xs leading-relaxed italic">
                      {campaign.additionalInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Content */}
          {activeSubTab === 'content' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                {/* Selected Concept */}
                {campaign.concepts && campaign.concepts.length > 0 && (
                  <div className="p-4 bg-white rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                        Selected Concept
                      </span>
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Concept Angle
                      </span>
                    </div>
                    {(() => {
                      const selected = campaign.concepts.find(c => c.id === campaign.selectedConceptId) || campaign.concepts[0];
                      return (
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{selected.title}</div>
                          <p className="text-xs text-stone-600 mt-1">{selected.explanation}</p>
                          <div className="text-xs text-stone-500 italic mt-2">
                            Angle: {selected.creativeAngle}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Headline */}
                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Headline
                  </div>
                  <div className="text-base font-bold text-stone-950">
                    {campaign.headline || 'No headline written yet.'}
                  </div>
                </div>

                {/* Caption */}
                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Draft Caption
                  </div>
                  <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                    {campaign.caption || 'No caption drafted yet.'}
                  </p>
                </div>

                {/* CTA and Hashtags */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Call To Action (CTA)
                    </div>
                    <span className="inline-block px-3 py-1 rounded bg-[#F5F3FF] text-[#7C3AED] font-semibold text-xs border border-purple-200">
                      {campaign.cta || 'Learn More'}
                    </span>
                  </div>

                  {campaign.hashtags && campaign.hashtags.length > 0 && (
                    <div className="pt-2 border-t border-stone-100">
                      <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                        Hashtags
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {campaign.hashtags.map((h, i) => (
                          <span key={i} className="text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md font-mono">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Preview */}
              <div className="lg:col-span-5">
                <SocialPreview
                  title={campaign.title}
                  headline={campaign.headline}
                  caption={campaign.caption}
                  cta={campaign.cta}
                  hashtags={campaign.hashtags}
                  platform={campaign.platform}
                  contentType={campaign.contentType}
                  allowToggle={true}
                />
              </div>
            </div>
          )}

          {/* Tab 3: Creative */}
          {activeSubTab === 'creative' && (
            <div className="space-y-6">
              {campaign.creativeDirection ? (
                <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                    <Compass size={16} className="text-[#7C3AED]" />
                    <span>Creative Direction & Art Guidance</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-150">
                      <span className="font-semibold text-stone-700 block mb-1">Visual Concept</span>
                      <p className="text-stone-600 leading-relaxed">{campaign.creativeDirection.visualConcept}</p>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-150">
                      <span className="font-semibold text-stone-700 block mb-1">Photography / Imagery</span>
                      <p className="text-stone-600 leading-relaxed">{campaign.creativeDirection.photographyStyle}</p>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-150">
                      <span className="font-semibold text-stone-700 block mb-1">Composition</span>
                      <p className="text-stone-600 leading-relaxed">{campaign.creativeDirection.composition}</p>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-150">
                      <span className="font-semibold text-stone-700 block mb-1">Mood</span>
                      <p className="text-stone-600 leading-relaxed">{campaign.creativeDirection.mood}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-150 text-xs">
                    <span className="font-semibold text-stone-700 block mb-1">Layout Direction</span>
                    <p className="text-stone-600 leading-relaxed">{campaign.creativeDirection.layoutDirection}</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-xs">
                  No creative direction stored for this campaign yet.
                </div>
              )}

              {/* Associated Assets */}
              <div className="p-5 bg-white rounded-xl border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-stone-900 text-sm">Associated Creative Assets</h4>
                  <span className="text-xs text-stone-400">{associatedAssets.length} assets</span>
                </div>
                {associatedAssets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {associatedAssets.map((asset) => (
                      <div key={asset.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-xs text-stone-900 truncate">{asset.name}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5">{asset.type} • {asset.dimensions}</div>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                          {asset.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-stone-400 italic">No linked library assets.</div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Approval */}
          {activeSubTab === 'approval' && (
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl border border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Human Approval Status</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Mandatory human verification required before scheduling.</p>
                  </div>
                  <StatusBadge status={campaign.status} size="lg" />
                </div>

                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Current Phase:</span>
                    <span className="font-semibold text-stone-800">{campaign.status}</span>
                  </div>
                  {campaign.approvedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Approved At:</span>
                      <span className="font-mono text-stone-800">{new Date(campaign.approvedAt).toLocaleString()}</span>
                    </div>
                  )}
                  {campaign.reviewerFeedback && (
                    <div className="pt-2 border-t border-stone-200">
                      <span className="font-semibold text-amber-900 block mb-1">Reviewer Feedback:</span>
                      <p className="text-amber-800 bg-amber-50/80 p-2.5 rounded border border-amber-200">
                        {campaign.reviewerFeedback}
                      </p>
                    </div>
                  )}
                </div>

                {campaign.status === 'Review' && (
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpenReview}
                      className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} /> Open Review &amp; Approval Center
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Schedule */}
          {activeSubTab === 'schedule' && (
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Publishing Schedule</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Scheduled time slots and automated dispatch simulation.</p>
                  </div>
                  <StatusBadge status={campaign.status} size="md" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-4">
                  <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-stone-400 uppercase tracking-wider font-semibold block mb-1">
                      Publication Date
                    </span>
                    <div className="text-stone-900 font-bold text-sm">
                      {campaign.scheduledDate || 'Not scheduled yet'}
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-stone-400 uppercase tracking-wider font-semibold block mb-1">
                      Publication Time
                    </span>
                    <div className="text-stone-900 font-bold text-sm">
                      {campaign.scheduledTime || '--:--'}
                    </div>
                  </div>
                </div>

                {campaign.publishedAt && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Published on {new Date(campaign.publishedAt).toLocaleString()}</span>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  {campaign.status === 'Approved' && (
                    <button
                      type="button"
                      onClick={handleOpenSchedule}
                      className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Calendar size={14} /> Schedule Post
                    </button>
                  )}

                  {campaign.status === 'Scheduled' && (
                    <button
                      type="button"
                      onClick={handlePublish}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Send size={14} /> Simulate Publish Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-white flex items-center justify-between">
          <div className="text-xs text-stone-400">
            Last updated {new Date(campaign.updatedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleEdit}
              className="px-3.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileEdit size={14} /> Edit Campaign
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
