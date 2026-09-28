import React from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { StatusBadge } from '../components/StatusBadge';
import { PlatformBadge } from '../components/PlatformBadge';
import { CreativeThumbnail } from '../components/CreativeThumbnail';
import {
  Layers,
  FileEdit,
  Clock,
  CalendarCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import { CampaignStatus } from '../types';

export const DashboardView: React.FC = () => {
  const {
    campaigns,
    metrics,
    pipelineCounts,
    setActiveTab,
    setSelectedCampaignId,
    setSchedulingCampaignId,
    setReviewingCampaignId,
  } = useCampaigns();

  const pipelineStages: { stage: CampaignStatus; label: string; desc: string }[] = [
    { stage: 'Idea', label: 'Idea', desc: 'Initial concepts' },
    { stage: 'Development', label: 'Development', desc: 'Drafts in progress' },
    { stage: 'Review', label: 'Review', desc: 'Human review required' },
    { stage: 'Approved', label: 'Approved', desc: 'Ready to schedule' },
    { stage: 'Scheduled', label: 'Scheduled', desc: 'Queued on calendar' },
    { stage: 'Published', label: 'Published', desc: 'Live campaigns' },
  ];

  // Upcoming content (Scheduled posts ordered by date)
  const upcomingContent = campaigns
    .filter((c) => c.status === 'Scheduled' && c.scheduledDate)
    .sort((a, b) => (a.scheduledDate! > b.scheduledDate! ? 1 : -1))
    .slice(0, 3);

  // Recent campaigns sorted by updatedAt
  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const kpis = [
    {
      label: 'Total Campaigns',
      value: metrics.total,
      icon: Layers,
      color: 'text-stone-700',
      bg: 'bg-stone-100',
      note: 'All active initiatives',
    },
    {
      label: 'Draft Content',
      value: metrics.draft,
      icon: FileEdit,
      color: 'text-sky-700',
      bg: 'bg-sky-50',
      note: 'Ideas & Development',
    },
    {
      label: 'Awaiting Approval',
      value: metrics.review,
      icon: Clock,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      note: 'Needs marketer review',
      alert: metrics.review > 0,
    },
    {
      label: 'Scheduled',
      value: metrics.scheduled,
      icon: CalendarCheck,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      note: 'Upcoming releases',
    },
    {
      label: 'Published',
      value: metrics.published,
      icon: CheckCircle,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      note: 'Successfully distributed',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
            Marketing Overview
          </h2>
          <p className="text-sm text-[#71717A] mt-1">
            Plan, create, review, and schedule your marketing content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold shadow-xs transition-colors"
          >
            <Sparkles size={16} />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:border-stone-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500">{kpi.label}</span>
                <div className={`w-7 h-7 rounded-md ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                  <Icon size={15} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                  {kpi.alert && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  <span>{kpi.note}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Pipeline Visualizer */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-stone-900">Content Pipeline</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Live workflow progression from concept ideation to publication.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
            {metrics.total} Initiatives
          </span>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {pipelineStages.map((item, idx) => {
            const count = pipelineCounts[item.stage] || 0;
            const isReview = item.stage === 'Review' && count > 0;
            const isApproved = item.stage === 'Approved' && count > 0;

            return (
              <div
                key={item.stage}
                onClick={() => setActiveTab('campaigns')}
                className={`relative p-3.5 rounded-lg border transition-all cursor-pointer group ${
                  isReview
                    ? 'border-amber-300 bg-amber-50/40 hover:border-amber-400'
                    : isApproved
                    ? 'border-purple-300 bg-purple-50/40 hover:border-purple-400'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span className="font-mono text-[10px]">0{idx + 1}</span>
                  {idx < 5 && (
                    <ChevronRight size={13} className="hidden md:block text-stone-300 group-hover:text-stone-500 transition-colors" />
                  )}
                </div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-[#7C3AED] transition-colors">
                  {item.label}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-bold text-stone-900 tracking-tight">
                    {count}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {count === 1 ? 'post' : 'posts'}
                  </span>
                </div>
                <div className="mt-2 h-1 w-full bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      item.stage === 'Published'
                        ? 'bg-emerald-500'
                        : item.stage === 'Scheduled'
                        ? 'bg-indigo-500'
                        : item.stage === 'Approved'
                        ? 'bg-purple-500'
                        : item.stage === 'Review'
                        ? 'bg-amber-500'
                        : 'bg-stone-400'
                    }`}
                    style={{ width: metrics.total > 0 ? `${Math.min(100, (count / metrics.total) * 100)}%` : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column: Upcoming Content & Recent Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Content */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-[#7C3AED]" />
                <h3 className="text-base font-bold text-stone-900">Upcoming Content</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className="text-xs font-medium text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 transition-colors"
              >
                View Full Calendar <ArrowRight size={13} />
              </button>
            </div>

            {upcomingContent.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingContent.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedCampaignId(item.id);
                      setActiveTab('campaigns');
                    }}
                    className="border border-stone-200 hover:border-stone-300 rounded-xl overflow-hidden group cursor-pointer transition-all bg-white shadow-2xs hover:shadow-xs flex flex-col"
                  >
                    <div className="h-32 w-full relative">
                      <CreativeThumbnail
                        title={item.title}
                        category={item.contentType}
                        platform={item.platform}
                        className="h-full rounded-none"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <PlatformBadge platform={item.platform} size="sm" />
                          <StatusBadge status={item.status} size="sm" />
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                          {item.headline || item.topic}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span className="font-medium text-stone-700">
                          {item.scheduledDate} {item.scheduledTime ? `at ${item.scheduledTime}` : ''}
                        </span>
                        <span className="text-stone-400">{item.contentType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                <p className="text-sm font-medium text-stone-600">No posts scheduled</p>
                <p className="text-xs text-stone-400 mt-1">
                  Approve content and schedule it to see it appear here.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('approvals')}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold bg-white border border-stone-200 rounded-md text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Go to Approvals
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Recent Campaigns List */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900">Recent Campaigns</h3>
              <button
                type="button"
                onClick={() => setActiveTab('campaigns')}
                className="text-xs font-medium text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              {recentCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  onClick={() => {
                    setSelectedCampaignId(camp.id);
                    setActiveTab('campaigns');
                  }}
                  className="p-3 rounded-lg border border-stone-150 hover:border-stone-300 hover:bg-stone-50/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs text-stone-900 truncate group-hover:text-[#7C3AED] transition-colors">
                        {camp.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-500">
                        <span>{camp.platform}</span>
                        <span>•</span>
                        <span className="truncate">{camp.contentType}</span>
                      </div>
                    </div>
                    <StatusBadge status={camp.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setActiveTab('campaigns')}
              className="w-full py-2 text-center text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200/80"
            >
              View All Campaigns ({campaigns.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
