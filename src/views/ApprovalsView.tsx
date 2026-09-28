import React, { useState } from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { Campaign, Platform } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PlatformBadge } from '../components/PlatformBadge';
import { CreativeThumbnail } from '../components/CreativeThumbnail';
import { SocialPreview } from '../components/SocialPreview';
import {
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Calendar,
  Sparkles,
  ArrowRight,
  X,
  Send,
  Building2,
  Compass,
  Clock
} from 'lucide-react';

export const ApprovalsView: React.FC = () => {
  const {
    campaigns,
    reviewingCampaignId,
    setReviewingCampaignId,
    requestChanges,
    approveCampaign,
    setSchedulingCampaignId,
    setActiveTab,
    showToast,
  } = useCampaigns();

  const [activeReviewCampaign, setActiveReviewCampaign] = useState<Campaign | null>(() => {
    if (reviewingCampaignId) {
      return campaigns.find((c) => c.id === reviewingCampaignId) || null;
    }
    return null;
  });

  const [showRequestChangesForm, setShowRequestChangesForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [justApproved, setJustApproved] = useState(false);

  // Review queue
  const reviewQueue = campaigns.filter((c) => c.status === 'Review');

  const openReview = (camp: Campaign) => {
    setActiveReviewCampaign(camp);
    setShowRequestChangesForm(false);
    setFeedbackText('');
    setJustApproved(false);
  };

  const closeReview = () => {
    setActiveReviewCampaign(null);
    setReviewingCampaignId(null);
    setShowRequestChangesForm(false);
    setJustApproved(false);
  };

  const handleApprove = (campId: string) => {
    approveCampaign(campId);
    setJustApproved(true);
  };

  const handleRequestChangesConfirm = (campId: string) => {
    if (!feedbackText.trim()) {
      showToast('Please enter reviewer feedback before requesting changes.', 'warning');
      return;
    }
    requestChanges(campId, feedbackText.trim());
    closeReview();
  };

  const handleProceedToSchedule = (campId: string) => {
    closeReview();
    setSchedulingCampaignId(campId);
    setActiveTab('calendar');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Content Approvals
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Review content before it moves to scheduling. Human approval is mandatory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            {reviewQueue.length} Pending Review
          </span>
        </div>
      </div>

      {/* Review Queue Cards */}
      {reviewQueue.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-base font-semibold text-stone-800">
            No content awaiting approval
          </p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            You're all caught up. When campaigns are submitted from the creator workspace, they will appear here.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className="mt-4 px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Sparkles size={14} /> Create New Content Brief
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviewQueue.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="h-40 w-full relative">
                <CreativeThumbnail
                  title={camp.title}
                  category={camp.contentType}
                  platform={camp.platform}
                  className="h-full rounded-none"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <PlatformBadge platform={camp.platform} size="sm" />
                    <StatusBadge status={camp.status} size="sm" />
                  </div>

                  <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-1">
                    {camp.title}
                  </h3>
                  <p className="text-xs font-medium text-stone-700 mt-1 line-clamp-1">
                    {camp.headline || 'No headline set'}
                  </p>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {camp.caption || camp.topic}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Submitted {new Date(camp.updatedAt).toLocaleDateString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => openReview(camp)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Review</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APPROVAL DETAIL SPLIT MODAL */}
      {activeReviewCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                <StatusBadge status={activeReviewCampaign.status} size="md" />
                <PlatformBadge platform={activeReviewCampaign.platform} size="md" />
                <h3 className="text-base font-bold text-stone-900 truncate">
                  Reviewing: {activeReviewCampaign.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeReview}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
              {/* LEFT: Social Preview */}
              <div className="lg:col-span-5 p-6 bg-stone-50/60 border-r border-stone-200 flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Visual &amp; Social Layout
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Live Rendering
                  </span>
                </div>
                <div className="flex-1">
                  <SocialPreview
                    title={activeReviewCampaign.title}
                    organization={activeReviewCampaign.organization}
                    headline={activeReviewCampaign.headline}
                    caption={activeReviewCampaign.caption}
                    cta={activeReviewCampaign.cta}
                    hashtags={activeReviewCampaign.hashtags}
                    platform={activeReviewCampaign.platform}
                    contentType={activeReviewCampaign.contentType}
                    allowToggle={true}
                  />
                </div>
              </div>

              {/* RIGHT: Campaign Information & Action Center */}
              <div className="lg:col-span-7 p-6 space-y-5 overflow-y-auto text-xs sm:text-sm">
                {/* Status banner */}
                {justApproved ? (
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 size={18} className="text-[#7C3AED]" />
                      <span>Content Approved!</span>
                    </div>
                    <p className="text-xs text-purple-800">
                      This campaign is now verified by marketing leadership. You can immediately proceed to schedule it on the Content Calendar.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleProceedToSchedule(activeReviewCampaign.id)}
                      className="mt-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar size={14} /> Schedule Content Now
                    </button>
                  </div>
                ) : null}

                {/* Campaign Summary Box */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block font-semibold uppercase tracking-wider text-[10px]">
                        Campaign
                      </span>
                      <span className="font-bold text-stone-900">{activeReviewCampaign.title}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-semibold uppercase tracking-wider text-[10px]">
                        Goal
                      </span>
                      <span className="text-stone-700">{activeReviewCampaign.goal || 'Safety Awareness'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-semibold uppercase tracking-wider text-[10px]">
                        Target Audience
                      </span>
                      <span className="text-stone-700">{activeReviewCampaign.targetAudience}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-semibold uppercase tracking-wider text-[10px]">
                        Topic
                      </span>
                      <span className="text-stone-700">{activeReviewCampaign.topic}</span>
                    </div>
                  </div>
                </div>

                {/* Selected Concept */}
                {activeReviewCampaign.concepts && activeReviewCampaign.concepts.length > 0 && (
                  <div className="p-4 bg-white rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Concept Angle
                    </span>
                    {(() => {
                      const conc = activeReviewCampaign.concepts.find(c => c.id === activeReviewCampaign.selectedConceptId) || activeReviewCampaign.concepts[0];
                      return (
                        <div>
                          <div className="font-bold text-stone-900 text-xs">{conc.title}</div>
                          <p className="text-xs text-stone-600 mt-0.5">{conc.explanation}</p>
                          <div className="text-[11px] text-purple-700 mt-1">Creative Angle: {conc.creativeAngle}</div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Headline & Caption */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Headline &amp; Copy
                  </span>
                  <div className="font-bold text-stone-900 text-sm">
                    {activeReviewCampaign.headline}
                  </div>
                  <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed pt-1 border-t border-stone-100">
                    {activeReviewCampaign.caption}
                  </p>
                </div>

                {/* Creative Direction */}
                {activeReviewCampaign.creativeDirection && (
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                      <Compass size={14} className="text-[#7C3AED]" />
                      <span>Creative Direction</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                      <div>
                        <span className="font-semibold text-stone-700 block">Style:</span>
                        {activeReviewCampaign.creativeDirection.photographyStyle}
                      </div>
                      <div>
                        <span className="font-semibold text-stone-700 block">Mood:</span>
                        {activeReviewCampaign.creativeDirection.mood}
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA and Hashtags */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] font-semibold uppercase">Call to Action</span>
                    <span className="font-semibold text-[#7C3AED]">{activeReviewCampaign.cta || 'Learn More'}</span>
                  </div>
                  {activeReviewCampaign.hashtags && (
                    <div className="flex flex-wrap gap-1">
                      {activeReviewCampaign.hashtags.map((h, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[11px] font-mono">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Request Changes Sub-form */}
                {showRequestChangesForm && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <MessageSquare size={14} /> Reviewer Feedback
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowRequestChangesForm(false)}
                        className="text-amber-700 hover:text-amber-950 text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Specify needed modifications. This will move the campaign back to the Development stage.
                    </p>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="e.g., Shorten the caption and emphasize high-altitude preparation."
                      className="w-full p-2.5 rounded-lg border border-amber-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRequestChangesConfirm(activeReviewCampaign.id)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Submit Feedback &amp; Request Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={closeReview}
                className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Close
              </button>

              {!justApproved && activeReviewCampaign.status === 'Review' && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRequestChangesForm(true)}
                    className="px-4 py-2 border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertCircle size={14} /> Request Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(activeReviewCampaign.id)}
                    className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={15} /> Approve Content
                  </button>
                </div>
              )}

              {justApproved && (
                <button
                  type="button"
                  onClick={() => handleProceedToSchedule(activeReviewCampaign.id)}
                  className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar size={15} /> Schedule Content
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
